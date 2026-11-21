import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  registrationRole: z.enum(['internship', 'donor', 'volunteer']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

export const systemRoleUpdateSchema = z.object({
  systemRole: z.enum(['user', 'staff', 'superadmin']),
});

export const applicationStatusSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
  reason: z.string().optional(),
});

export const applicationNoteSchema = z.object({
  text: z.string().min(1, 'Note content cannot be empty'),
});

export const bulkApplicationsSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
});

export const manualDonationSchema = z.object({
  donor_name: z.string().min(1, 'Donor name is required'),
  donor_email: z.string().email('Valid donor email is required'),
  donor_phone: z.string().optional(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  currency: z.string().default('INR'),
  method: z.enum(['cash', 'bank_transfer', 'cheque', 'online']).default('cash'),
  notes: z.string().optional(),
  program_id: z.string().optional().nullable(),
});

export const donationStatusSchema = z.object({
  status: z.enum(['pending', 'succeeded', 'failed', 'refunded']),
});

export const settingsUpdateSchema = z.object({
  siteName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  donationNotice: z.string().optional(),
});
