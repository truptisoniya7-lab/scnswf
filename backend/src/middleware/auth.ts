import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/security';
import { sendError } from '../utils/response';
import { Role } from '../types';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 401, 'authentication_required', 'Authentication credentials were not provided.');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    sendError(res, 401, 'token_invalid', 'Given token not valid for any token type or expired.');
  }
};

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'authentication_required', 'Authentication credentials were not provided.');
      return;
    }

    if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
      next();
      return;
    }

    sendError(res, 403, 'permission_denied', 'You do not have permission to perform this action.');
  };
};
