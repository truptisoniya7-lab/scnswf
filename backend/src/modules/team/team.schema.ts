import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  name: z.string().min(2).max(150),
  role_title: z.string().min(2).max(150),
  bio: z.string().min(10),
  photo_url: z.string().url(),
  category: z.enum(['leadership', 'team']),
  status: z.enum(['draft', 'published']).default('published'),
  display_order: z.number().int().default(0),
});
