import { Router } from 'express';
import { accountsController } from './accounts.controller';
import { validateRequest } from '../../middleware/validate';
import {
  loginSchema,
  refreshSchema,
  volunteerRequestOtpSchema,
  volunteerVerifyOtpSchema,
  googleAuthSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
} from './accounts.schema';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Admin Authentication (POST /api/v1/auth/admin/login or /api/v1/accounts/auth/login)
router.post(
  ['/auth/admin/login', '/auth/admin/login/', '/admin/login', '/admin/login/'],
  authLimiter,
  validateRequest({ body: loginSchema }),
  accountsController.login
);


// Google Sign-In & Sign-Up (POST /api/v1/auth/google)
router.post(
  ['/auth/google', '/auth/google/', '/google', '/google/'],
  authLimiter,
  validateRequest({ body: googleAuthSchema }),
  accountsController.googleAuth
);

router.post(
  ['/login', '/login/', '/auth/login', '/auth/login/'],
  authLimiter,
  validateRequest({ body: loginSchema }),
  accountsController.login
);

// User Registration (POST /api/v1/auth/register or /api/v1/accounts/auth/register)
router.post(
  ['/register', '/register/', '/auth/register', '/auth/register/'],
  authLimiter,
  validateRequest({ body: registerSchema }),
  accountsController.register
);

// Password Recovery - Request Reset OTP (POST /api/v1/auth/forgot-password)
router.post(
  ['/forgot-password', '/forgot-password/', '/auth/forgot-password', '/auth/forgot-password/'],
  authLimiter,
  validateRequest({ body: forgotPasswordSchema }),
  accountsController.forgotPassword
);

// Password Recovery - Verify Reset OTP (POST /api/v1/auth/verify-reset-otp)
router.post(
  ['/verify-reset-otp', '/verify-reset-otp/', '/auth/verify-reset-otp', '/auth/verify-reset-otp/'],
  authLimiter,
  validateRequest({ body: verifyResetOtpSchema }),
  accountsController.verifyResetOtp
);

// Password Recovery - Reset Password (POST /api/v1/auth/reset-password)
router.post(
  ['/reset-password', '/reset-password/', '/auth/reset-password', '/auth/reset-password/'],
  authLimiter,
  validateRequest({ body: resetPasswordSchema }),
  accountsController.resetPassword
);

// Volunteer OTP Request (POST /api/v1/auth/volunteer/request-otp)
router.post(
  [
    '/auth/volunteer/request-otp',
    '/auth/volunteer/request-otp/',
    '/volunteer/request-otp',
    '/volunteer/request-otp/',
  ],
  authLimiter,
  validateRequest({ body: volunteerRequestOtpSchema }),
  accountsController.volunteerRequestOtp
);

// Volunteer OTP Verify (POST /api/v1/auth/volunteer/verify-otp)
router.post(
  [
    '/auth/volunteer/verify-otp',
    '/auth/volunteer/verify-otp/',
    '/volunteer/verify-otp',
    '/volunteer/verify-otp/',
  ],
  authLimiter,
  validateRequest({ body: volunteerVerifyOtpSchema }),
  accountsController.volunteerVerifyOtp
);

// Session Refresh (POST /api/v1/auth/refresh)
router.post(
  ['/auth/refresh', '/auth/refresh/', '/refresh', '/refresh/'],
  validateRequest({ body: refreshSchema }),
  accountsController.refresh
);

// Logout (POST /api/v1/auth/logout)
router.post(
  ['/auth/logout', '/auth/logout/', '/logout', '/logout/'],
  accountsController.logout
);

// Current User Profile (GET /api/v1/auth/me)
router.get(
  ['/me', '/me/', '/auth/me', '/auth/me/'],
  authenticate,
  accountsController.me
);

export default router;
