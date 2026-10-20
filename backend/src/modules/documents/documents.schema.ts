import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(2).max(200),
  category: z.string().min(2).max(50),
  file_url: z.string().url(),
  visibility: z.enum(['public', 'private']).default('public'),
});

export const createAnnualReportSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  title: z.string().min(2).max(200),
  file_url: z.string().url(),
  status: z.enum(['draft', 'published']).default('published'),
});
