import { Router } from 'express';
import { newsletterController } from './newsletter.controller';
import { validateRequest } from '../../middleware/validate';
import { newsletterSchema } from './newsletter.schema';
import { formLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/subscribe', formLimiter, validateRequest({ body: newsletterSchema }), newsletterController.subscribe);
router.post('/subscribe/', formLimiter, validateRequest({ body: newsletterSchema }), newsletterController.subscribe);

export default router;
