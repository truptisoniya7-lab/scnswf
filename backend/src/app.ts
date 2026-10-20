import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { sendError } from './utils/response';
import { swaggerRouter } from './config/swagger';
import accountsRouter from './modules/accounts/accounts.routes';
import programsRouter, { adminProgramsRouter } from './modules/programs/programs.routes';
import impactRouter, { adminImpactRouter } from './modules/impact/impact.routes';
import galleryRouter, { adminGalleryRouter } from './modules/gallery/gallery.routes';
import eventsRouter, { adminEventsRouter } from './modules/events/events.routes';
import partnersRouter, { adminPartnersRouter } from './modules/partners/partners.routes';
import teamRouter, { adminTeamRouter } from './modules/team/team.routes';
import applicationsRouter, { adminApplicationsRouter } from './modules/applications/applications.routes';
import contactRouter, { adminContactRouter } from './modules/contact/contact.routes';
import newsletterRouter from './modules/newsletter/newsletter.routes';
import donationsRouter, { adminDonationsRouter } from './modules/donations/donations.routes';
import documentsRouter, { adminDocumentsRouter } from './modules/documents/documents.routes';
import auditRouter from './modules/audit/audit.routes';

export const createApp = () => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allows Swagger UI assets
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (
          env.NODE_ENV === 'development' ||
          env.corsOrigins.includes(origin) ||
          env.corsOrigins.includes('*')
        ) {
          return callback(null, true);
        }
        return callback(new Error('CORS policy: Not allowed by CORS origins'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  if (env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  // Root Index / Welcome
  const rootIndexHandler = (_req: Request, res: Response) => {
    res.json({
      name: 'SCNSWF Backend REST API',
      version: '1.0.0',
      status: 'healthy',
      docs: '/api/v1/schema/swagger-ui/',
      schema: '/api/v1/schema/',
      health: '/api/v1/health/',
      endpoints: {
        programs: '/api/v1/programs/',
        impact_metrics: '/api/v1/impact/metrics/',
        impact_stories: '/api/v1/impact/stories/',
        gallery_albums: '/api/v1/gallery/albums/',
        events: '/api/v1/events/',
        partners: '/api/v1/partners/',
        team: '/api/v1/team/',
        annual_reports: '/api/v1/documents/annual-reports/',
        contact: '/api/v1/contact/',
        applications_volunteer: '/api/v1/applications/volunteer/',
        newsletter_subscribe: '/api/v1/newsletter/subscribe/',
        donations: '/api/v1/donations/',
        auth_login: '/api/v1/accounts/auth/login/',
      },
    });
  };
  app.get('/', rootIndexHandler);
  app.get('/docs', (_req: Request, res: Response) => res.redirect('/api/v1/schema/swagger-ui/'));
  app.get('/swagger', (_req: Request, res: Response) => res.redirect('/api/v1/schema/swagger-ui/'));

  // Root Health Check
  const rootHealthHandler = (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  };
  app.get('/health', rootHealthHandler);
  app.get('/health/', rootHealthHandler);

  // API v1 Router
  const apiV1 = express.Router();

  // Apply general rate limiter on public api endpoints
  if (env.NODE_ENV === 'production') {
    apiV1.use(apiLimiter);
  }

  // API v1 root
  apiV1.get('/', rootIndexHandler);

  // API Health Check
  const apiHealthHandler = (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  };
  apiV1.get('/health', apiHealthHandler);
  apiV1.get('/health/', apiHealthHandler);

  // OpenAPI Swagger Documentation
  apiV1.use('/schema', swaggerRouter);
  apiV1.use('/docs', swaggerRouter);

  // Public & Domain routes
  apiV1.use('/accounts', accountsRouter);
  apiV1.use('/programs', programsRouter);
  apiV1.use('/impact', impactRouter);
  apiV1.use('/gallery', galleryRouter);
  apiV1.use('/events', eventsRouter);
  apiV1.use('/partners', partnersRouter);
  apiV1.use('/team', teamRouter);
  apiV1.use('/applications', applicationsRouter);
  apiV1.use('/contact', contactRouter);
  apiV1.use('/newsletter', newsletterRouter);
  apiV1.use('/donations', donationsRouter);
  apiV1.use('/documents', documentsRouter);

  // Admin CMS routes
  apiV1.use('/admin/programs', adminProgramsRouter);
  apiV1.use('/admin/impact', adminImpactRouter);
  apiV1.use('/admin/gallery', adminGalleryRouter);
  apiV1.use('/admin/events', adminEventsRouter);
  apiV1.use('/admin/partners', adminPartnersRouter);
  apiV1.use('/admin/team', adminTeamRouter);
  apiV1.use('/admin/applications', adminApplicationsRouter);
  apiV1.use('/admin/contact', adminContactRouter);
  apiV1.use('/admin/donations', adminDonationsRouter);
  apiV1.use('/admin/documents', adminDocumentsRouter);
  apiV1.use('/admin/audit-log', auditRouter);

  // Mount API v1
  app.use('/api/v1', apiV1);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    sendError(res, 404, 'not_found', 'The requested endpoint was not found on this server.');
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
