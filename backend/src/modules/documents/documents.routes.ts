import { Router } from 'express';
import { documentsController } from './documents.controller';
import { validateRequest } from '../../middleware/validate';
import { createDocumentSchema, createAnnualReportSchema } from './documents.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', documentsController.getDocuments);
router.get('/annual-reports', documentsController.getAnnualReports);
router.get('/annual-reports/', documentsController.getAnnualReports);

export const adminDocumentsRouter = Router();
adminDocumentsRouter.use(authenticate, authorize(['content_editor']));

adminDocumentsRouter.post('/', validateRequest({ body: createDocumentSchema }), documentsController.createDocument);
adminDocumentsRouter.post('/annual-reports', validateRequest({ body: createAnnualReportSchema }), documentsController.createAnnualReport);
adminDocumentsRouter.post('/annual-reports/', validateRequest({ body: createAnnualReportSchema }), documentsController.createAnnualReport);

export default router;
