import { z } from 'zod';

export const createEventSchema = z.object({
  slug: z.string().min(2).max(160),
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  location: z.string().min(2).max(255),
  start_datetime: z.string().datetime(),
  end_datetime: z.string().datetime(),
  status: z.enum(['draft', 'published', 'cancelled']).default('published'),
});
