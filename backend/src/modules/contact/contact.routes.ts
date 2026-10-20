import { Router } from 'express';
import { contactController } from './contact.controller';
import { validateRequest } from '../../middleware/validate';
import { contactMessageSchema, contactStatusSchema } from './contact.schema';
import { formLimiter } from '../../middleware/rateLimiter';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public submission
router.post('/', formLimiter, validateRequest({ body: contactMessageSchema }), contactController.submit);

export const adminContactRouter = Router();
adminContactRouter.use(authenticate, authorize(['applications_reviewer']));

adminContactRouter.get('/', contactController.listAdmin);
adminContactRouter.patch('/:id/status', validateRequest({ body: contactStatusSchema }), contactController.updateStatus);
adminContactRouter.patch('/:id/status/', validateRequest({ body: contactStatusSchema }), contactController.updateStatus);

export default router;
