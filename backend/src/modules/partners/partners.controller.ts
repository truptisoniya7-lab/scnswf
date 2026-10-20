import { Request, Response } from 'express';
import { partnersRepo, auditRepo } from '../../db';
import { sendSuccess } from '../../utils/response';

export const partnersController = {
  listPublic: async (_req: Request, res: Response): Promise<void> => {
    const items = partnersRepo.findAll({ status: 'published' });
    sendSuccess(res, items);
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const created = partnersRepo.create({
      ...req.body,
      website_url: req.body.website_url || null,
    });

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_partner',
        entity_type: 'Partner',
        entity_id: created.id,
        details: { name: created.name },
      });
    }

    sendSuccess(res, created, 201);
  },
};
