import { Router } from 'express';
import { impactController } from './impact.controller';
import { validateRequest } from '../../middleware/validate';
import { createMetricSchema, createStorySchema } from './impact.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/metrics', impactController.getMetrics);
router.get('/metrics/', impactController.getMetrics);
router.get('/stories', impactController.getStories);
router.get('/stories/', impactController.getStories);
router.get('/stories/:slug', impactController.getStoryBySlug);
router.get('/stories/:slug/', impactController.getStoryBySlug);

export const adminImpactRouter = Router();
adminImpactRouter.use(authenticate, authorize(['content_editor']));

adminImpactRouter.post('/metrics', validateRequest({ body: createMetricSchema }), impactController.createMetric);
adminImpactRouter.post('/metrics/', validateRequest({ body: createMetricSchema }), impactController.createMetric);
adminImpactRouter.post('/stories', validateRequest({ body: createStorySchema }), impactController.createStory);
adminImpactRouter.post('/stories/', validateRequest({ body: createStorySchema }), impactController.createStory);

export default router;
