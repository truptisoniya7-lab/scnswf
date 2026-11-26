import { Request, Response } from 'express';
import { usersRepo, auditRepo, applicationsRepo, dbStore } from '../../db';
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

    const computedSystemRole = user.systemRole || (user.role === 'super_admin' ? 'superadmin' : user.role === 'admin' || user.isStaff ? 'staff' : 'user');
    sendSuccess(res, {
      accessToken: access,
      access,
      refresh,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role,
        systemRole: computedSystemRole,
        is_staff: user.isStaff,
        phone: user.phone || '',
        status: user.status || (user.isActive ? 'active' : 'suspended'),
        createdAt: user.createdAt || new Date().toISOString(),
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
    const computedSystemRole = user.systemRole || (user.role === 'super_admin' ? 'superadmin' : user.role === 'admin' || user.isStaff ? 'staff' : 'user');

    sendSuccess(res, {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,
      systemRole: computedSystemRole,
      registrationRole: user.registrationRole || (['internship', 'donor', 'volunteer'].includes(user.role) ? user.role : 'volunteer'),
      status: user.status || (user.isActive ? 'active' : 'suspended'),
      is_staff: user.isStaff,
      phone: profile?.phone || user.phone || null,
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

  // ==========================================
  // PASSWORDLESS LOGIN (Spec: login.md)
  // ==========================================

  loginStart: async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await otpService.startPasswordlessLogin(email);

    auditRepo.log({
      actor_user_id: 'anonymous',
      actor_email: email,
      action: 'login_start_otp_requested',
      entity_type: 'Auth',
      entity_id: result.loginId,
      details: { ip: req.ip, loginId: result.loginId },
    });

    sendSuccess(res, result);
  },

  loginVerify: async (req: Request, res: Response): Promise<void> => {
    const { loginId, otp } = req.body;
    const result = otpService.verifyPasswordlessLogin(loginId, otp);

    if (!result.success || !result.user) {
      const status = result.errorType === 'OTP_EXPIRED' ? 400 : 400;
      sendError(res, status, result.errorType || 'OTP_INVALID', result.message);
      return;
    }

    const user = result.user;
    const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Supporter';
    const computedSystemRole = user.systemRole || (user.role === 'super_admin' ? 'superadmin' : user.role === 'admin' || user.isStaff ? 'staff' : 'user');
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      systemRole: computedSystemRole,
      name: fullName,
    };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: user.id,
      actor_email: user.email,
      action: 'passwordless_login_verified',
      entity_type: 'User',
      entity_id: user.id,
      details: { ip: req.ip },
    });

    sendSuccess(res, {
      accessToken: access,
      access,
      refresh,
      user: {
        id: user.id,
        name: fullName,
        phone: user.phone || '',
        email: user.email,
        emailVerified: true,
        role: user.role,
        systemRole: computedSystemRole,
        registrationRole: user.registrationRole || (['internship', 'donor', 'volunteer'].includes(user.role) ? user.role : 'volunteer'),
        status: user.status || (user.isActive ? 'active' : 'suspended'),
        createdAt: user.createdAt || new Date().toISOString(),
      },
    });
  },

  loginResend: async (req: Request, res: Response): Promise<void> => {
    const { loginId } = req.body;
    const result = await otpService.resendPasswordlessLogin(loginId);

    if (!result.success) {
      const status = result.errorType === 'RATE_LIMITED' ? 429 : 400;
      sendError(res, status, result.errorType || 'RATE_LIMITED', result.message);
      return;
    }

    sendSuccess(res, {
      otpExpiresInSec: result.otpExpiresInSec,
      resendAfterSec: result.resendAfterSec,
    });
  },

  // ==========================================
  // PASSWORDLESS REGISTER (Spec: register.md)
  // ==========================================

  registerStart: async (req: Request, res: Response): Promise<void> => {
    const { name, phone, email, password } = req.body;
    const result = await otpService.startPasswordlessRegister(name, phone, email, password);

    if (!result.success) {
      if (result.errorType === 'EMAIL_EXISTS') {
        sendError(res, 409, 'EMAIL_EXISTS', result.message || 'This email is already registered. Log in instead.');
        return;
      }
      sendError(res, 400, result.errorType || 'INVALID_INPUT', result.message || 'Invalid registration details.');
      return;
    }

    auditRepo.log({
      actor_user_id: 'anonymous',
      actor_email: email,
      action: 'register_start_otp_requested',
      entity_type: 'Registration',
      entity_id: result.registrationId || 'anonymous',
      details: { ip: req.ip, registrationId: result.registrationId },
    });

    sendSuccess(res, {
      registrationId: result.registrationId,
      otpExpiresInSec: result.otpExpiresInSec,
      resendAfterSec: result.resendAfterSec,
    });
  },

  registerVerify: async (req: Request, res: Response): Promise<void> => {
    const { registrationId, otp } = req.body;
    const result = otpService.verifyPasswordlessRegister(registrationId, otp);

    if (!result.success) {
      sendError(res, 400, result.errorType || 'OTP_INVALID', result.message);
      return;
    }

    sendSuccess(res, { verified: true });
  },

  registerResend: async (req: Request, res: Response): Promise<void> => {
    const { registrationId } = req.body;
    const result = await otpService.resendPasswordlessRegister(registrationId);

    if (!result.success) {
      const status = result.errorType === 'RATE_LIMITED' ? 429 : 400;
      sendError(res, status, result.errorType || 'RATE_LIMITED', result.message);
      return;
    }

    sendSuccess(res, {
      otpExpiresInSec: result.otpExpiresInSec,
      resendAfterSec: result.resendAfterSec,
    });
  },

  registerComplete: async (req: Request, res: Response): Promise<void> => {
    const { registrationId, role } = req.body;
    const result = otpService.completePasswordlessRegister(registrationId, role);

    if (!result.success || !result.user) {
      const status = result.errorType === 'EMAIL_EXISTS' ? 409 : 400;
      sendError(res, status, result.errorType || 'INVALID_INPUT', result.message);
      return;
    }

    const newUser = result.user;
    const payload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };
    const access = generateAccessToken(payload);
    const refresh = generateRefreshToken(payload);

    auditRepo.log({
      actor_user_id: newUser.id,
      actor_email: newUser.email,
      action: 'user_register_completed',
      entity_type: 'User',
      entity_id: newUser.id,
      details: { ip: req.ip, role },
    });

    sendSuccess(
      res,
      {
        accessToken: access,
        access,
        refresh,
        user: newUser,
      },
      201
    );
  },

  // ==========================================
  // VOLUNTEER / USER PORTAL
  // ==========================================
  getPortalDashboard: async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 401, 'authentication_required', 'Authentication required.');
      return;
    }

    const userId = req.user.userId;
    const user = usersRepo.findById(userId) || usersRepo.findByEmail(req.user.email);
    if (!user) {
      sendError(res, 404, 'not_found', 'User account not found.');
      return;
    }

    const state = dbStore.getState();
    state.userPortalData = state.userPortalData || {};
    if (!state.userPortalData[user.id]) {
      state.userPortalData[user.id] = {
        eventsJoined: 5,
        volunteerHours: 48,
        campsSupported: 2,
        certificatesEarned: 1,
        joinedEventIds: ['e3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111'],
        activities: [
          {
            id: 'act-1',
            text: 'You joined the Free Health Check-up Camp',
            timestamp: '2 days ago',
          },
          {
            id: 'act-2',
            text: 'You completed your volunteer hours',
            timestamp: '5 days ago',
          },
          {
            id: 'act-3',
            text: 'Certificate for Community Health Drive awarded',
            timestamp: '1 week ago',
          },
          {
            id: 'act-4',
            text: 'Account registered and email verified',
            timestamp: '2 weeks ago',
          },
        ],
      };
      dbStore.update(() => {});
    }

    const portalData = state.userPortalData[user.id];
    const upcomingEvents = (state.events || []).filter((e: any) => e.status === 'published');
    const computedSystemRole =
      user.systemRole || (user.role === 'super_admin' ? 'superadmin' : user.role === 'admin' || user.isStaff ? 'staff' : 'user');

    sendSuccess(res, {
      user: {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Member',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'volunteer',
        systemRole: computedSystemRole,
        status: user.status || (user.isActive ? 'active' : 'suspended'),
        createdAt: user.createdAt,
      },
      stats: {
        eventsJoined: portalData.eventsJoined,
        volunteerHours: portalData.volunteerHours,
        campsSupported: portalData.campsSupported,
        certificatesEarned: portalData.certificatesEarned,
      },
      joinedEventIds: portalData.joinedEventIds || [],
      upcomingEvents,
      recentActivities: portalData.activities || [],
    });
  },

  joinPortalEvent: async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 401, 'authentication_required', 'Authentication required.');
      return;
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const state = dbStore.getState();
    const event = (state.events || []).find((e: any) => e.id === id || e.slug === id);

    if (!event) {
      sendError(res, 404, 'event_not_found', 'Event not found.');
      return;
    }

    state.userPortalData = state.userPortalData || {};
    if (!state.userPortalData[userId]) {
      state.userPortalData[userId] = {
        eventsJoined: 0,
        volunteerHours: 0,
        campsSupported: 0,
        certificatesEarned: 0,
        joinedEventIds: [],
        activities: [],
      };
    }

    const data = state.userPortalData[userId];
    data.joinedEventIds = data.joinedEventIds || [];
    if (!data.joinedEventIds.includes(event.id)) {
      data.joinedEventIds.push(event.id);
      data.eventsJoined = (data.eventsJoined || 0) + 1;
      if (event.title.toLowerCase().includes('camp')) {
        data.campsSupported = (data.campsSupported || 0) + 1;
      }
      data.activities = [
        {
          id: `act-${Date.now()}`,
          text: `You joined the ${event.title}`,
          timestamp: 'Just now',
        },
        ...(data.activities || []),
      ];
      dbStore.update(() => {});
    }

    auditRepo.log({
      actor_user_id: userId,
      actor_email: req.user.email,
      action: 'volunteer_joined_event',
      entity_type: 'Event',
      entity_id: event.id,
      details: { eventTitle: event.title },
    });

    sendSuccess(res, {
      message: `Successfully registered for ${event.title}!`,
      stats: {
        eventsJoined: data.eventsJoined,
        volunteerHours: data.volunteerHours,
        campsSupported: data.campsSupported,
        certificatesEarned: data.certificatesEarned,
      },
      joinedEventIds: data.joinedEventIds,
      recentActivities: data.activities,
    });
  },

  updatePortalProfile: async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 401, 'authentication_required', 'Authentication required.');
      return;
    }

    const userId = req.user.userId;
    const { name, phone } = req.body;
    const user = usersRepo.findById(userId);

    if (!user) {
      sendError(res, 404, 'not_found', 'User not found.');
      return;
    }

    if (name) {
      const parts = name.trim().split(/\s+/);
      user.firstName = parts[0] || user.firstName;
      user.lastName = parts.slice(1).join(' ') || user.lastName;
    }
    if (phone) {
      user.phone = phone;
    }
    user.updatedAt = new Date().toISOString();
    dbStore.update(() => {});

    sendSuccess(res, {
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      },
    });
  },
};
