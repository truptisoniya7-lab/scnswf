import { z } from 'zod';

export const contactMessageSchema = z.object({
  first_name: z.string().min(1, 'First name is required.').max(100),
  last_name: z.string().min(1, 'Last name is required.').max(100),
  email: z.string().email('Enter a valid email address.').max(255),
  phone: z.string().min(8, 'Phone number must be at least 8 digits.').max(20),
  subject: z.string().min(2, 'Subject is required.').max(255),
  message: z.string().min(5, 'Message must be at least 5 characters.'),
  newsletter_subscription: z.boolean().default(false),
});

export const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'responded']),
});
