import { Router } from 'express';
import { programsController } from './programs.controller';
import { validateRequest } from '../../middleware/validate';
import {
  createProgramSchema,
  updateProgramSchema,
  createServiceSchema,
} from './programs.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', programsController.listPublic);
router.get('/:slug', programsController.getBySlug);
router.get('/:slug/', programsController.getBySlug);
router.get('/:slug/services', programsController.getServices);
router.get('/:slug/services/', programsController.getServices);

export const adminProgramsRouter = Router();
adminProgramsRouter.use(authenticate, authorize(['content_editor']));

adminProgramsRouter.get('/', programsController.listAdmin);
adminProgramsRouter.post('/', validateRequest({ body: createProgramSchema }), programsController.create);
adminProgramsRouter.put('/:id', validateRequest({ body: updateProgramSchema }), programsController.update);
adminProgramsRouter.patch('/:id', validateRequest({ body: updateProgramSchema }), programsController.update);
adminProgramsRouter.delete('/:id', programsController.delete);
adminProgramsRouter.post('/:id/services', validateRequest({ body: createServiceSchema }), programsController.createService);

export default router;
