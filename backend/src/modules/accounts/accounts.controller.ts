import { Request, Response } from 'express';
import { usersRepo, auditRepo } from '../../db';
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/security';
import { sendSuccess, sendError } from '../../utils/response';

export const accountsController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = usersRepo.findByEmail(email);

    if (!user || !user.isActive) {
      sendError(res, 401, 'invalid_credentials', 'No active account found with the given credentials.');
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      sendError(res, 401, 'invalid_credentials', 'No active account found with the given credentials.');
      return;
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: user.id,
      actor_email: user.email,
      action: 'login',
      entity_type: 'User',
      entity_id: user.id,
      details: { ip: req.ip },
    });

    sendSuccess(res, {
      access,
      refresh,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        is_staff: user.isStaff,
      },
    });
  },

  refresh: async (req: Request, res: Response): Promise<void> => {
    const { refresh } = req.body;
    try {
      const payload = verifyRefreshToken(refresh);
      const user = usersRepo.findById(payload.userId);
      if (!user || !user.isActive) {
        sendError(res, 401, 'token_invalid', 'User inactive or no longer exists.');
        return;
      }

      const access = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      sendSuccess(res, { access });
    } catch (err) {
      sendError(res, 401, 'token_invalid', 'Token is invalid or expired.');
    }
  },

  logout: async (_req: Request, res: Response): Promise<void> => {
    // Stateless JWT: client discards access/refresh token
    sendSuccess(res, { message: 'Successfully logged out.' });
  },

  me: async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 401, 'authentication_required', 'Authentication credentials were not provided.');
      return;
    }

    const user = usersRepo.findById(req.user.userId);
    if (!user) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    const profile = usersRepo.findProfileByUserId(user.id);

    sendSuccess(res, {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      is_staff: user.isStaff,
      phone: profile?.phone || null,
      avatar_url: profile?.avatarUrl || null,
      created_at: user.createdAt,
    });
  },
};
