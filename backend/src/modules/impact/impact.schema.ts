import { z } from 'zod';

export const createMetricSchema = z.object({
  program_id: z.string().uuid().nullable().optional(),
  label: z.string().min(2).max(150),
  value: z.number().positive(),
  unit: z.string().min(1).max(30),
  period_start: z.string().nullable().optional(),
  period_end: z.string().nullable().optional(),
});

export const createStorySchema = z.object({
  slug: z.string().min(2).max(160),
  title: z.string().min(2).max(200),
  summary: z.string().min(10),
  body: z.string().min(20),
  program_id: z.string().uuid().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  published_at: z.string().nullable().optional(),
});
