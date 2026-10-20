import { z } from 'zod';

export const createPartnerSchema = z.object({
  name: z.string().min(2).max(200),
  logo_url: z.string().url(),
  website_url: z.string().url().nullable().optional(),
  partnership_type: z.string().min(2).max(50),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});
