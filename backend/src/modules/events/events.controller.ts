import { Request, Response } from 'express';
import { eventsRepo, auditRepo } from '../../db';
import { sendSuccess, sendPaginated, sendError } from '../../utils/response';

export const eventsController = {
  listPublic: async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : 20;
    const search = req.query.search as string | undefined;

    const result = eventsRepo.findAll({
      status: 'published',
      search,
      page,
      pageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  getBySlug: async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const event = eventsRepo.findBySlug(slug);

    if (!event || event.status !== 'published') {
      sendError(res, 404, 'not_found', 'Event not found.');
      return;
    }

    sendSuccess(res, event);
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const existing = eventsRepo.findBySlug(req.body.slug);
    if (existing) {
      sendError(res, 409, 'conflict', 'An event with this slug already exists.');
      return;
    }

    const created = eventsRepo.create(req.body);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_event',
        entity_type: 'Event',
        entity_id: created.id,
        details: { title: created.title },
      });
    }

    sendSuccess(res, created, 201);
  },
};
