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
