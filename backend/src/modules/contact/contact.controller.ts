import { Request, Response } from 'express';
import { contactRepo, auditRepo } from '../../db';
import { sendSuccess, sendError } from '../../utils/response';

export const contactController = {
  submit: async (req: Request, res: Response): Promise<void> => {
    const created = contactRepo.create(req.body);
    sendSuccess(
      res,
      {
        id: created.id,
        status: created.status,
        created_at: created.created_at,
      },
      201
    );
  },

  listAdmin: async (_req: Request, res: Response): Promise<void> => {
    const items = contactRepo.findAll();
    sendSuccess(res, items);
  },

  updateStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = contactRepo.updateStatus(id, status);

    if (!updated) {
      sendError(res, 404, 'not_found', 'Contact message not found.');
      return;
    }

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'update_contact_status',
        entity_type: 'ContactMessage',
        entity_id: id,
        details: { status },
      });
    }

    sendSuccess(res, updated);
  },
};
