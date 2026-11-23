import { z } from 'zod'

export const detailsStepSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters.')
      .max(60, 'Name cannot exceed 60 characters.')
      .regex(/^[A-Za-z\s.'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes.")
      .transform(v => v.trim()),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
    email: z
      .string()
      .email('Please enter a valid email address.')
      .transform(v => v.toLowerCase().trim()),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z
      .string()
      .min(6, 'Please confirm your password.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type DetailsStepForm = z.infer<typeof detailsStepSchema>

export const loginPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .transform(v => v.toLowerCase().trim()),
  password: z
    .string()
    .min(1, 'Password is required.'),
})

export type LoginPasswordForm = z.infer<typeof loginPasswordSchema>

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .transform(v => v.toLowerCase().trim()),
})

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, 'Enter the complete 6-digit verification code.'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmNewPassword: z.string().min(6, 'Confirm your new password.'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  })

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export const emailStepSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .transform(v => v.toLowerCase().trim()),
})

export type EmailStepForm = z.infer<typeof emailStepSchema>

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the complete 6-digit verification code.'),
})

export type OtpForm = z.infer<typeof otpSchema>

export const roleStepSchema = z.object({
  role: z.enum(['internship', 'donor', 'volunteer'], {
    message: 'Please select a role to continue.',
  }),
})

export type RoleStepForm = z.infer<typeof roleStepSchema>
