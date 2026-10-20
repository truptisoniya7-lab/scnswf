import { Request, Response } from 'express';
import { impactRepo, auditRepo } from '../../db';
import { sendSuccess, sendPaginated, sendError } from '../../utils/response';

export const impactController = {
  getMetrics: async (req: Request, res: Response): Promise<void> => {
    const programId = req.query.program as string | undefined;
    const metrics = impactRepo.findMetrics({
      program_id: programId !== undefined ? programId : undefined,
    });
    sendSuccess(res, metrics);
  },

  getStories: async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : 20;
    const search = req.query.search as string | undefined;

    const result = impactRepo.findStories({
      status: 'published',
      search,
      page,
      pageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  getStoryBySlug: async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const story = impactRepo.findStoryBySlug(slug);

    if (!story || story.status !== 'published') {
      sendError(res, 404, 'not_found', 'Impact story not found.');
      return;
    }

    sendSuccess(res, story);
  },

  createMetric: async (req: Request, res: Response): Promise<void> => {
    const created = impactRepo.createMetric({
      ...req.body,
      program_id: req.body.program_id || null,
      period_start: req.body.period_start || null,
      period_end: req.body.period_end || null,
    });

    sendSuccess(res, created, 201);
  },

  createStory: async (req: Request, res: Response): Promise<void> => {
    const existing = impactRepo.findStoryBySlug(req.body.slug);
    if (existing) {
      sendError(res, 409, 'conflict', 'A story with this slug already exists.');
      return;
    }

    const created = impactRepo.createStory({
      ...req.body,
      program_id: req.body.program_id || null,
      cover_image_url: req.body.cover_image_url || null,
      published_at: req.body.published_at || (req.body.status === 'published' ? new Date().toISOString() : null),
    });

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_impact_story',
        entity_type: 'ImpactStory',
        entity_id: created.id,
        details: { title: created.title },
      });
    }

    sendSuccess(res, created, 201);
  },
};
