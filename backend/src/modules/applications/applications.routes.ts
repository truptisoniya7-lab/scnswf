import { Router } from 'express';
import { applicationsController } from './applications.controller';
import { validateRequest } from '../../middleware/validate';
import {
  volunteerApplicationSchema,
  internshipApplicationSchema,
  partnershipRequestSchema,
  statusUpdateSchema,
} from './applications.schema';
import { formLimiter } from '../../middleware/rateLimiter';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public submission endpoints (rate-limited)
router.post(
  '/volunteer',
  formLimiter,
  validateRequest({ body: volunteerApplicationSchema }),
  applicationsController.submitVolunteer
);
router.post(
  '/volunteer/',
  formLimiter,
  validateRequest({ body: volunteerApplicationSchema }),
  applicationsController.submitVolunteer
);

router.post(
  '/internship',
  formLimiter,
  validateRequest({ body: internshipApplicationSchema }),
  applicationsController.submitInternship
);
router.post(
  '/internship/',
  formLimiter,
  validateRequest({ body: internshipApplicationSchema }),
  applicationsController.submitInternship
);

router.post(
  '/partnership',
  formLimiter,
  validateRequest({ body: partnershipRequestSchema }),
  applicationsController.submitPartnership
);
router.post(
  '/partnership/',
  formLimiter,
  validateRequest({ body: partnershipRequestSchema }),
  applicationsController.submitPartnership
);

export const adminApplicationsRouter = Router();
adminApplicationsRouter.use(authenticate, authorize(['applications_reviewer']));

adminApplicationsRouter.get('/volunteer', applicationsController.listVolunteer);
adminApplicationsRouter.get('/volunteer/', applicationsController.listVolunteer);
adminApplicationsRouter.patch(
  '/volunteer/:id/status',
  validateRequest({ body: statusUpdateSchema }),
  applicationsController.updateVolunteerStatus
);
adminApplicationsRouter.patch(
  '/volunteer/:id/status/',
  validateRequest({ body: statusUpdateSchema }),
  applicationsController.updateVolunteerStatus
);

adminApplicationsRouter.get('/internship', applicationsController.listInternship);
adminApplicationsRouter.get('/internship/', applicationsController.listInternship);

adminApplicationsRouter.get('/partnership', applicationsController.listPartnership);
adminApplicationsRouter.get('/partnership/', applicationsController.listPartnership);

export default router;
