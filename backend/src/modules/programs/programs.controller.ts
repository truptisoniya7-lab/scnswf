import { Request, Response } from 'express';
import { programsRepo, auditRepo } from '../../db';
import { sendSuccess, sendPaginated, sendError } from '../../utils/response';

export const programsController = {
  // Public list (only published)
  listPublic: async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : 20;
    const search = req.query.search as string | undefined;

    const result = programsRepo.findAll({
      status: 'published',
      search,
      page,
      pageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  // Public detail by slug
  getBySlug: async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const program = programsRepo.findBySlug(slug);

    if (!program || program.status !== 'published') {
      sendError(res, 404, 'not_found', 'Program not found.');
      return;
    }

    sendSuccess(res, program);
  },

  // Public program services
  getServices: async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const program = programsRepo.findBySlug(slug);

    if (!program || program.status !== 'published') {
      sendError(res, 404, 'not_found', 'Program not found.');
      return;
    }

    const services = programsRepo.findServicesByProgramId(program.id);
    sendSuccess(res, services);
  },

  // Admin list (can see all statuses)
  listAdmin: async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : 20;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const result = programsRepo.findAll({
      status,
      search,
      page,
      pageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  // Admin create
  create: async (req: Request, res: Response): Promise<void> => {
    const existing = programsRepo.findBySlug(req.body.slug);
    if (existing) {
      sendError(res, 409, 'conflict', 'A program with this slug already exists.');
      return;
    }

    const created = programsRepo.create({
      ...req.body,
      cover_image_url: req.body.cover_image_url || null,
    });

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_program',
        entity_type: 'Program',
        entity_id: created.id,
        details: { title: created.title, slug: created.slug },
      });
    }

    sendSuccess(res, created, 201);
  },

  // Admin update
  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const existing = programsRepo.findById(id);
    if (!existing) {
      sendError(res, 404, 'not_found', 'Program not found.');
      return;
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugExists = programsRepo.findBySlug(req.body.slug);
      if (slugExists) {
        sendError(res, 409, 'conflict', 'A program with this slug already exists.');
        return;
      }
    }

    const updated = programsRepo.update(id, req.body);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'update_program',
        entity_type: 'Program',
        entity_id: id,
        details: req.body,
      });
    }

    sendSuccess(res, updated);
  },

  // Admin delete
  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const existing = programsRepo.findById(id);
    if (!existing) {
      sendError(res, 404, 'not_found', 'Program not found.');
      return;
    }

    programsRepo.delete(id);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'delete_program',
        entity_type: 'Program',
        entity_id: id,
        details: { title: existing.title },
      });
    }

    res.status(204).send();
  },

  // Admin create service
  createService: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const program = programsRepo.findById(id);
    if (!program) {
      sendError(res, 404, 'not_found', 'Program not found.');
      return;
    }

    const created = programsRepo.createService({
      program_id: id,
      title: req.body.title,
      description: req.body.description,
      display_order: req.body.display_order ?? 0,
    });

    sendSuccess(res, created, 201);
  },
};
