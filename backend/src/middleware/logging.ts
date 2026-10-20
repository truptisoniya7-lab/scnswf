

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Capture finish event for structured logging
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const severity = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARNING' : 'INFO';

    const logEntry = {
      severity,
      message: `${req.method} ${req.originalUrl || req.url} ${statusCode} - ${duration}ms`,
      timestamp: new Date().toISOString(),
      requestId,
      httpRequest: {
        requestMethod: req.method,
        requestUrl: req.originalUrl || req.url,
        status: statusCode,
        userAgent: req.headers['user-agent'],
        remoteIp: req.ip,
        latency: `${(duration / 1000).toFixed(3)}s`,
      },
    };

    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else if (process.env.NODE_ENV !== 'test') {
      console.log(`[${severity}] [${requestId.slice(0, 8)}] ${logEntry.message}`);
    }
  });

  next();
}
