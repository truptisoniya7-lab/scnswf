import { Router } from 'express';
import { eventsController } from './events.controller';
import { validateRequest } from '../../middleware/validate';
import { createEventSchema } from './events.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', eventsController.listPublic);
router.get('/:slug', eventsController.getBySlug);
router.get('/:slug/', eventsController.getBySlug);

export const adminEventsRouter = Router();
adminEventsRouter.use(authenticate, authorize(['content_editor']));

adminEventsRouter.post('/', validateRequest({ body: createEventSchema }), eventsController.create);

export default router;
