import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SCNSWF Website Rebuild API',
    version: '1.0.0',
    description: 'REST API for Suresh Chandra Nayak Social Welfare Foundation, built with Express and TypeScript.',
    contact: {
      name: 'SCNSWF Technical Support',
      email: 'tech@scnswf.org',
    },
  },
  servers: [
    {
      url: 'http://localhost:8000/api/v1',
      description: 'Local development server',
    },
    {
      url: 'https://api.scnswf.org/api/v1',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: {
                type: 'object',
                additionalProperties: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health/': {
      get: {
        summary: 'API health check',
        responses: {
          200: {
            description: 'API is healthy and operational',
          },
        },
      },
    },
    '/programs/': {
      get: {
        summary: 'List published programs (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'page_size', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Paginated list of programs' } },
      },
    },
    '/programs/{slug}/': {
      get: {
        summary: 'Retrieve program detail by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Program detail' }, 404: { description: 'Not found' } },
      },
    },
    '/impact/metrics/': {
      get: {
        summary: 'Retrieve impact metrics',
        responses: { 200: { description: 'Impact metrics list' } },
      },
    },
    '/impact/stories/': {
      get: {
        summary: 'List impact stories (paginated)',
        responses: { 200: { description: 'Paginated impact stories' } },
      },
    },
    '/gallery/albums/': {
      get: {
        summary: 'List gallery albums',
        responses: { 200: { description: 'Gallery albums list' } },
      },
    },
    '/events/': {
      get: {
        summary: 'List upcoming events',
        responses: { 200: { description: 'Events list' } },
      },
    },
    '/partners/': {
      get: {
        summary: 'List corporate and government partners',
        responses: { 200: { description: 'Partners list' } },
      },
    },
    '/team/': {
      get: {
        summary: 'List team and leadership members',
        responses: { 200: { description: 'Team list' } },
      },
    },
    '/contact/': {
      post: {
        summary: 'Submit contact inquiry form',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['first_name', 'last_name', 'email', 'phone', 'subject', 'message'],
                properties: {
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  subject: { type: 'string' },
                  message: { type: 'string' },
                  newsletter_subscription: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Contact inquiry created' } },
      },
    },
    '/donations/': {
      post: {
        summary: 'Initiate a charitable donation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: {
                  program_id: { type: 'string', format: 'uuid', nullable: true },
                  amount: { type: 'number', minimum: 1 },
                  currency: { type: 'string', default: 'INR' },
                  is_anonymous: { type: 'boolean' },
                  donor_name: { type: 'string' },
                  donor_email: { type: 'string', format: 'email' },
                  donor_phone: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Donation order created' } },
      },
    },
    '/accounts/auth/login/': {
      post: {
        summary: 'Admin login to obtain JWT access & refresh tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Tokens issued' }, 401: { description: 'Invalid credentials' } },
      },
    },
  },
};

export const swaggerRouter = Router();

// Swagger UI at /api/v1/schema/swagger-ui/
swaggerRouter.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(openApiSpec));
swaggerRouter.use('/swagger-ui/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Raw OpenAPI JSON schema at /api/v1/schema/
swaggerRouter.get('/', (_req, res) => {
  res.json(openApiSpec);
});
