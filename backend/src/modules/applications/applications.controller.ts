import { Request, Response } from 'express';
import { applicationsRepo, auditRepo } from '../../db';
import { sendSuccess, sendError } from '../../utils/response';

export const applicationsController = {
  // Public submissions
  submitVolunteer: async (req: Request, res: Response): Promise<void> => {
    const created = applicationsRepo.createVolunteer(req.body);
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

  submitInternship: async (req: Request, res: Response): Promise<void> => {
    const created = applicationsRepo.createInternship(req.body);
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

  submitPartnership: async (req: Request, res: Response): Promise<void> => {
    const created = applicationsRepo.createPartnership(req.body);
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

  // Admin lists
  listVolunteer: async (_req: Request, res: Response): Promise<void> => {
    const items = applicationsRepo.findAllVolunteer();
    sendSuccess(res, items);
  },

  updateVolunteerStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = applicationsRepo.updateVolunteerStatus(id, status);

    if (!updated) {
      sendError(res, 404, 'not_found', 'Volunteer application not found.');
      return;
    }

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'update_volunteer_status',
        entity_type: 'VolunteerApplication',
        entity_id: id,
        details: { status },
      });
    }

    sendSuccess(res, updated);
  },

  listInternship: async (_req: Request, res: Response): Promise<void> => {
    const items = applicationsRepo.findAllInternship();
    sendSuccess(res, items);
  },

  listPartnership: async (_req: Request, res: Response): Promise<void> => {
    const items = applicationsRepo.findAllPartnership();
    sendSuccess(res, items);
  },
};
