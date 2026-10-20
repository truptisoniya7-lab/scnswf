import { Response } from 'express';
import { PaginatedMeta } from '../types';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({ data });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  meta: PaginatedMeta,
  statusCode = 200
) => {
  return res.status(statusCode).json({ data, meta });
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, string[]>
) => {
  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
};
