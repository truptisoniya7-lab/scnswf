import { Router, Request, Response } from 'express';
import { auditRepo } from '../../db';
import { authenticate, authorize } from '../../middleware/auth';
import { sendSuccess } from '../../utils/response';

const router = Router();
router.use(authenticate, authorize(['super_admin']));

router.get('/', (_req: Request, res: Response) => {
  const logs = auditRepo.findAll();
  sendSuccess(res, logs);
});

export default router;
