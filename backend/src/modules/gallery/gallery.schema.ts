import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const createImageSchema = z.object({
  image_url: z.string().url('Must be a valid image URL.'),
  caption: z.string().min(2).max(255),
  alt_text: z.string().min(2).max(255),
  display_order: z.number().int().default(0),
});
