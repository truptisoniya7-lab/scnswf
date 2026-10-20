import { Request, Response } from 'express';
import { documentsRepo, auditRepo } from '../../db';
import { sendSuccess } from '../../utils/response';

export const documentsController = {
  getAnnualReports: async (_req: Request, res: Response): Promise<void> => {
    const reports = documentsRepo.findAnnualReports({ status: 'published' });
    sendSuccess(res, reports);
  },

  getDocuments: async (req: Request, res: Response): Promise<void> => {
    const category = req.query.category as string | undefined;
    const docs = documentsRepo.findDocuments({
      visibility: 'public',
      category,
    });
    sendSuccess(res, docs);
  },

  createDocument: async (req: Request, res: Response): Promise<void> => {
    const newDoc = documentsRepo.createDocument(req.body);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_document',
        entity_type: 'Document',
        entity_id: newDoc.id,
        details: { title: newDoc.title },
      });
    }

    sendSuccess(res, newDoc, 201);
  },

  createAnnualReport: async (req: Request, res: Response): Promise<void> => {
    const newReport = documentsRepo.createAnnualReport(req.body);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_annual_report',
        entity_type: 'AnnualReport',
        entity_id: newReport.id,
        details: { year: newReport.year, title: newReport.title },
      });
    }

    sendSuccess(res, newReport, 201);
  },
};
