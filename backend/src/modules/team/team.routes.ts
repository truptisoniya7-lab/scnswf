import { Router } from 'express';
import { teamController } from './team.controller';
import { validateRequest } from '../../middleware/validate';
import { createTeamMemberSchema } from './team.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', teamController.listPublic);

export const adminTeamRouter = Router();
adminTeamRouter.use(authenticate, authorize(['content_editor']));

adminTeamRouter.post('/', validateRequest({ body: createTeamMemberSchema }), teamController.create);

export default router;
