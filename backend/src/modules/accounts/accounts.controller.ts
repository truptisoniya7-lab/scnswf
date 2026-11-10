import { Request, Response } from 'express';
import { usersRepo, auditRepo, applicationsRepo } from '../../db';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/security';
import { sendSuccess, sendError } from '../../utils/response';
import { otpService } from './otp.service';

const ADMIN_ROLES = ['super_admin', 'admin', 'content_editor', 'applications_reviewer'];

export const accountsController = {
  // Authentication (email + password)
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = usersRepo.findByEmail(email);

    if (!user || !user.isActive) {
      sendError(res, 401, 'invalid_credentials', 'No active account found with the given credentials.');
      return;
    }

    // Backend-authoritative verification: ensure admin privileges only if requesting admin routes
    const isAdminPath = req.path.includes('/admin');
    if (isAdminPath && !user.isStaff && !ADMIN_ROLES.includes(user.role)) {
      sendError(res, 403, 'permission_denied', 'This account is not authorized for administrative access.');
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      sendError(res, 401, 'invalid_credentials', 'No active account found with the given credentials.');
      return;
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`.trim(),
    };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: user.id,
      actor_email: user.email,
      action: isAdminPath ? 'admin_login' : 'user_login',
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
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role,
        is_staff: user.isStaff,
      },
    });
  },

  // Volunteer OTP Request
  volunteerRequestOtp: async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await otpService.requestOtp(email);

    if (!result.success) {
      if (result.errorType === 'not_found') {
        sendError(res, 404, 'volunteer_not_found', result.message);
        return;
      }
      if (result.errorType === 'not_approved') {
        sendError(res, 403, 'volunteer_not_approved', result.message);
        return;
      }
      if (result.errorType === 'cooldown') {
        sendError(res, 429, 'cooldown_active', result.message, {
          cooldown_seconds: result.cooldownSeconds,
        });
        return;
      }
      sendError(res, 500, 'otp_dispatch_failed', result.message);
      return;
    }

    sendSuccess(res, {
      message: result.message,
      resend_cooldown: result.cooldownSeconds || 60,
    });
  },

  // Volunteer OTP Verification
  volunteerVerifyOtp: async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const result = otpService.verifyOtp(email, otp);

    if (!result.success || !result.volunteer) {
      const statusCode = result.errorType === 'not_found' ? 404 : 400;
      sendError(res, statusCode, result.errorType || 'verification_failed', result.message);
      return;
    }

    const payload = {
      userId: result.volunteer.id,
      email: result.volunteer.email,
      role: 'volunteer' as const,
      name: result.volunteer.name,
    };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: result.volunteer.id,
      actor_email: result.volunteer.email,
      action: 'volunteer_otp_login',
      entity_type: 'VolunteerApplication',
      entity_id: result.volunteer.id,
      details: { ip: req.ip },
    });

    sendSuccess(res, {
      access,
      refresh,
      user: {
        id: result.volunteer.id,
        email: result.volunteer.email,
        name: result.volunteer.name,
        role: 'volunteer',
      },
    });
  },

  refresh: async (req: Request, res: Response): Promise<void> => {
    const { refresh } = req.body;
    try {
      const payload = verifyRefreshToken(refresh);

      // Handle volunteer refresh
      if (payload.role === 'volunteer') {
        const volunteer = otpService.findApprovedVolunteer(payload.email);
        if (!volunteer || !volunteer.isApproved) {
          sendError(res, 401, 'token_invalid', 'Volunteer account no longer approved or active.');
          return;
        }

        const access = generateAccessToken({
          userId: volunteer.id,
          email: volunteer.email,
          role: 'volunteer',
          name: volunteer.name,
        });
        sendSuccess(res, { access });
        return;
      }

      // Handle staff / admin refresh
      const user = usersRepo.findById(payload.userId);
      if (!user || !user.isActive) {
        sendError(res, 401, 'token_invalid', 'User inactive or no longer exists.');
        return;
      }

      const access = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`.trim(),
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

    if (req.user.role === 'volunteer') {
      const volunteer = otpService.findApprovedVolunteer(req.user.email);
      if (!volunteer) {
        sendError(res, 404, 'not_found', 'Volunteer record not found.');
        return;
      }

      sendSuccess(res, {
        id: volunteer.id,
        email: volunteer.email,
        name: volunteer.name,
        role: 'volunteer',
        status: volunteer.status,
        phone: (volunteer as any).phone || null,
        location: (volunteer as any).location || null,
        skills: (volunteer as any).skills || null,
      });
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
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,
      is_staff: user.isStaff,
      phone: profile?.phone || null,
      avatar_url: profile?.avatarUrl || null,
      created_at: user.createdAt,
    });
  },

  // Google Authentication (Sign In & Sign Up)
  googleAuth: async (req: Request, res: Response): Promise<void> => {
    const { email, name, avatar } = req.body;
    let user = usersRepo.findByEmail(email);

    if (!user) {
      const parts = (name || 'Supporter').trim().split(' ');
      const firstName = parts[0] || 'SCNSWF';
      const lastName = parts.slice(1).join(' ') || 'Member';

      user = usersRepo.create({
        email: email.toLowerCase().trim(),
        passwordHash: '',
        salt: '',
        firstName,
        lastName,
        isStaff: false,
        isActive: true,
        role: 'volunteer',
      });
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Supporter';
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: fullName,
    };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: user.id,
      actor_email: user.email,
      action: 'google_auth_login',
      entity_type: 'User',
      entity_id: user.id,
      details: { ip: req.ip, avatar },
    });

    sendSuccess(res, {
      access,
      refresh,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        name: fullName,
        role: user.role,
        is_staff: user.isStaff,
        avatar_url: avatar || null,
      },
    });
  },

  // User Registration
  register: async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, role } = req.body;
    const normalized = email.toLowerCase().trim();
    const existing = usersRepo.findByEmail(normalized);

    if (existing) {
      sendError(res, 409, 'user_already_exists', 'An account with this email address already exists. Please log in.');
      return;
    }

    const { hash, salt } = hashPassword(password);
    const parts = (name || 'Member').trim().split(/\s+/);
    const firstName = parts[0] || 'Member';
    const lastName = parts.slice(1).join(' ') || '';

    const newUser = usersRepo.create({
      email: normalized,
      passwordHash: hash,
      salt,
      firstName,
      lastName,
      isStaff: false,
      isActive: true,
      role: (role as any) || 'volunteer',
    });

    const fullName = `${newUser.firstName} ${newUser.lastName}`.trim();
    const payload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: fullName,
    };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: newUser.id,
      actor_email: newUser.email,
      action: 'user_register',
      entity_type: 'User',
      entity_id: newUser.id,
      details: { ip: req.ip },
    });

    sendSuccess(
      res,
      {
        access,
        refresh,
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          name: fullName,
          role: newUser.role,
          is_staff: newUser.isStaff,
        },
      },
      201
    );
  },

  // Password Recovery: Request Reset OTP
  forgotPassword: async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await otpService.requestPasswordResetOtp(email);

    if (!result.success) {
      if (result.errorType === 'cooldown') {
        sendError(res, 429, 'cooldown_active', result.message, {
          cooldown_seconds: result.cooldownSeconds,
        });
        return;
      }
      sendError(res, 500, 'otp_dispatch_failed', result.message);
      return;
    }

    sendSuccess(res, {
      message: result.message,
      resend_cooldown: result.cooldownSeconds || 60,
    });
  },

  // Password Recovery: Verify OTP Code
  verifyResetOtp: async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const result = otpService.verifyPasswordResetOtp(email, otp);

    if (!result.success) {
      sendError(res, 400, result.errorType || 'invalid_otp', result.message);
      return;
    }

    sendSuccess(res, {
      message: result.message,
      email,
      verified: true,
    });
  },

  // Password Recovery: Reset Password
  resetPassword: async (req: Request, res: Response): Promise<void> => {
    const { email, otp, newPassword } = req.body;
    const normalized = email.toLowerCase().trim();

    const consumed = otpService.consumePasswordResetOtp(normalized, otp);
    if (!consumed) {
      sendError(res, 400, 'invalid_otp', 'Verification code is invalid or has expired.');
      return;
    }

    const user = usersRepo.findByEmail(normalized);
    if (!user) {
      sendError(res, 404, 'not_found', 'No user account found for this email address.');
      return;
    }

    const { hash, salt } = hashPassword(newPassword);
    usersRepo.updatePassword(user.id, hash, salt);

    auditRepo.log({
      actor_user_id: user.id,
      actor_email: user.email,
      action: 'password_reset',
      entity_type: 'User',
      entity_id: user.id,
      details: { ip: req.ip },
    });

    sendSuccess(res, {
      message: 'Your password has been reset successfully. Please log in with your new password.',
    });
  },
};
