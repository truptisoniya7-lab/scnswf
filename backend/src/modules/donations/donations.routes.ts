import { Router } from 'express';
import { donationsController } from './donations.controller';
import { validateRequest } from '../../middleware/validate';
import { createDonationSchema, donationWebhookSchema } from './donations.schema';
import { formLimiter } from '../../middleware/rateLimiter';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.post('/', formLimiter, validateRequest({ body: createDonationSchema }), donationsController.create);
router.get('/:id', donationsController.getStatus);
router.get('/:id/', donationsController.getStatus);
router.post('/:id/verify', donationsController.verifyPayment);
router.post('/:id/verify/', donationsController.verifyPayment);
router.post('/webhook/:provider', validateRequest({ body: donationWebhookSchema }), donationsController.handleWebhook);
router.post('/webhook/:provider/', validateRequest({ body: donationWebhookSchema }), donationsController.handleWebhook);

export const adminDonationsRouter = Router();
adminDonationsRouter.use(authenticate, authorize(['super_admin']));

adminDonationsRouter.get('/', donationsController.listAdmin);
adminDonationsRouter.post('/:id/refund', donationsController.refund);
adminDonationsRouter.post('/:id/refund/', donationsController.refund);

export default router;
