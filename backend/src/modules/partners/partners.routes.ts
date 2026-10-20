import { Router } from 'express';
import { partnersController } from './partners.controller';
import { validateRequest } from '../../middleware/validate';
import { createPartnerSchema } from './partners.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', partnersController.listPublic);

export const adminPartnersRouter = Router();
adminPartnersRouter.use(authenticate, authorize(['content_editor']));

adminPartnersRouter.post('/', validateRequest({ body: createPartnerSchema }), partnersController.create);

export default router;
