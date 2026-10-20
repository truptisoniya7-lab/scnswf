import { Router } from 'express';
import { accountsController } from './accounts.controller';
import { validateRequest } from '../../middleware/validate';
import { loginSchema, refreshSchema } from './accounts.schema';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/auth/login', authLimiter, validateRequest({ body: loginSchema }), accountsController.login);
router.post('/auth/login/', authLimiter, validateRequest({ body: loginSchema }), accountsController.login);

router.post('/auth/refresh', validateRequest({ body: refreshSchema }), accountsController.refresh);
router.post('/auth/refresh/', validateRequest({ body: refreshSchema }), accountsController.refresh);

router.post('/auth/logout', accountsController.logout);
router.post('/auth/logout/', accountsController.logout);

router.get('/me', authenticate, accountsController.me);
router.get('/me/', authenticate, accountsController.me);

export default router;
