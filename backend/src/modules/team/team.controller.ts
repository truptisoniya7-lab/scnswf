import { Request, Response } from 'express';
import { teamRepo, auditRepo } from '../../db';
import { sendSuccess } from '../../utils/response';

export const teamController = {
  listPublic: async (req: Request, res: Response): Promise<void> => {
    const category = req.query.category as string | undefined;
    const items = teamRepo.findAll({
      status: 'published',
      category,
    });
    sendSuccess(res, items);
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const created = teamRepo.create(req.body);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_team_member',
        entity_type: 'TeamMember',
        entity_id: created.id,
        details: { name: created.name, role: created.role_title },
      });
    }

    sendSuccess(res, created, 201);
  },
};
