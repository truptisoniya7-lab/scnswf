import { z } from 'zod';

export const createDonationSchema = z.object({
  program_id: z.string().uuid().nullable().optional(),
  amount: z.number().positive('Amount must be greater than zero.'),
  currency: z.string().default('INR'),
  is_anonymous: z.boolean().default(false),
  donor_name: z.string().max(150).nullable().optional(),
  donor_email: z.string().email().nullable().optional(),
  donor_phone: z.string().max(20).nullable().optional(),
});

export const donationWebhookSchema = z.object({
  event: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});
