import { z } from 'zod';

export const volunteerApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(150),
  email: z.string().email('Enter a valid email address.').max(255),
  phone: z.string().min(8, 'Phone number must be at least 8 digits.').max(20),
  location: z.string().min(2).max(255),
  skills: z.string().min(2),
  availability: z.string().min(2).max(100),
  experience: z.string().default(''),
  message: z.string().min(5),
});

export const internshipApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(150),
  email: z.string().email('Enter a valid email address.').max(255),
  phone: z.string().min(8, 'Phone number must be at least 8 digits.').max(20),
  education: z.string().min(2).max(255),
  area_of_interest: z.string().min(2).max(150),
  duration: z.string().min(2).max(100),
  resume_url: z.string().url().optional(),
  message: z.string().min(5),
});

export const partnershipRequestSchema = z.object({
  organization_name: z.string().min(2).max(255),
  contact_person: z.string().min(2).max(150),
  email: z.string().email('Enter a valid email address.').max(255),
  phone: z.string().min(8, 'Phone number must be at least 8 digits.').max(20),
  partnership_type: z.string().min(2).max(50),
  message: z.string().min(5),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['new', 'in_review', 'accepted', 'rejected']),
});
