import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const refreshSchema = z.object({
  refresh: z.string().min(1, 'Refresh token is required.'),
});

export const volunteerRequestOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export const volunteerVerifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be exactly 6 digits.'),
});


export const googleAuthSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  name: z.string().optional(),
  avatar: z.string().optional(),
  idToken: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  name: z.string().min(1, 'Full name is required.'),
  phone: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'content_editor', 'applications_reviewer', 'volunteer']).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export const verifyResetOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be exactly 6 digits.'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be exactly 6 digits.'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
});

// Passwordless Login Schemas (Spec: login.md)
export const loginStartSchema = z.object({
  email: z.string().email('Please enter a valid email address.').transform((v) => v.toLowerCase().trim()),
});

export const loginVerifySchema = z.object({
  loginId: z.string().min(1, 'Login ID is required.'),
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be exactly 6 digits.'),
});

export const loginResendSchema = z.object({
  loginId: z.string().min(1, 'Login ID is required.'),
});

// Passwordless Register Schemas (Spec: register.md)
export const registerStartSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(60, 'Name cannot exceed 60 characters.')
    .regex(/^[A-Za-z\s.'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes.')
    .transform((v) => v.trim()),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.'),
  email: z.string().email('Please enter a valid email address.').transform((v) => v.toLowerCase().trim()),
});

export const registerVerifySchema = z.object({
  registrationId: z.string().min(1, 'Registration ID is required.'),
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be exactly 6 digits.'),
});

export const registerResendSchema = z.object({
  registrationId: z.string().min(1, 'Registration ID is required.'),
});

export const registerCompleteSchema = z.object({
  registrationId: z.string().min(1, 'Registration ID is required.'),
  role: z.enum(['internship', 'donor', 'volunteer'], {
    errorMap: () => ({ message: 'Please select a valid role.' }),
  }),
});
