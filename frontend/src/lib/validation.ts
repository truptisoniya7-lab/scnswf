import { z } from 'zod'

export const detailsStepSchema = z.object({
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
})

export type DetailsStepForm = z.infer<typeof detailsStepSchema>

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
