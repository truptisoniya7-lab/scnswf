import { z } from 'zod';

export const programQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  page_size: z.coerce.number().min(1).max(100).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  search: z.string().optional(),
});

export const createProgramSchema = z.object({
  slug: z.string().min(2).max(160),
  title: z.string().min(2).max(200),
  summary: z.string().min(10),
  description: z.string().min(20),
  problem_addressed: z.string().min(10),
  geographical_coverage: z.string().min(2),
  cover_image_url: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  display_order: z.number().int().default(0),
});

export const updateProgramSchema = createProgramSchema.partial();

export const createServiceSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  display_order: z.number().int().default(0),
});
