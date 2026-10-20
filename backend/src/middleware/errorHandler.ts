import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, string[]>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 500 ? 'internal_server_error' : 'error');
  const message =
    statusCode === 500
      ? 'An unexpected server error occurred. Please contact support if the issue persists.'
      : err.message || 'An error occurred processing your request.';

  if (statusCode === 500) {
    console.error('Unhandled server error:', err);
  }

  sendError(res, statusCode, code, message, err.details);
};
