import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

describe('SCNSWF API Health & Documentation', () => {
  it('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('1.0.0');
  });

  it('GET /api/v1/health/ returns healthy status and connected database', async () => {
    const res = await request(app).get('/api/v1/health/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database).toBe('connected');
  });

  it('GET /api/v1/schema/ returns OpenAPI specification JSON', async () => {
    const res = await request(app).get('/api/v1/schema/');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.info.title).toContain('SCNSWF');
  });
});

describe('Public Content Endpoints', () => {
  it('GET /api/v1/programs/ returns paginated programs', async () => {
    const res = await request(app).get('/api/v1/programs/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toHaveProperty('count');
    expect(res.body.meta).toHaveProperty('page_size');
  });

  it('GET /api/v1/programs/:slug/ returns program detail', async () => {
    const res = await request(app).get('/api/v1/programs/healthcare-medical-relief/');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('healthcare-medical-relief');
    expect(res.body.data.title).toContain('Healthcare');
  });

  it('GET /api/v1/programs/:slug/services/ returns services', async () => {
    const res = await request(app).get('/api/v1/programs/healthcare-medical-relief/services/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/impact/metrics/ returns metrics', async () => {
    const res = await request(app).get('/api/v1/impact/metrics/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/impact/stories/ returns paginated stories', async () => {
    const res = await request(app).get('/api/v1/impact/stories/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/gallery/albums/ returns albums', async () => {
    const res = await request(app).get('/api/v1/gallery/albums/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/events/ returns events', async () => {
    const res = await request(app).get('/api/v1/events/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/partners/ returns partner organizations', async () => {
    const res = await request(app).get('/api/v1/partners/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/team/ returns team members', async () => {
    const res = await request(app).get('/api/v1/team/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/documents/annual-reports/ returns published reports', async () => {
    const res = await request(app).get('/api/v1/documents/annual-reports/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Form Submissions & Validation', () => {
  it('POST /api/v1/contact/ validates and creates contact inquiry', async () => {
    const payload = {
      first_name: 'Anita',
      last_name: 'Sahoo',
      email: 'anita@example.com',
      phone: '+919876543210',
      subject: 'Inquiry regarding medical camp',
      message: 'I would like to volunteer or coordinate for the upcoming health camp.',
      newsletter_subscription: true,
    };

    const res = await request(app).post('/api/v1/contact/').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.status).toBe('new');
  });

  it('POST /api/v1/contact/ rejects invalid email with standard error envelope', async () => {
    const payload = {
      first_name: 'Anita',
      last_name: 'Sahoo',
      email: 'not-an-email',
      phone: '+919876543210',
      subject: 'Subject',
      message: 'Message content here.',
    };

    const res = await request(app).post('/api/v1/contact/').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_error');
    expect(res.body.error.details).toHaveProperty('email');
  });

  it('POST /api/v1/applications/volunteer/ accepts valid application', async () => {
    const payload = {
      name: 'Rahul Mishra',
      email: 'rahul.mishra@example.com',
      phone: '+919876501234',
      location: 'Cuttack, Odisha',
      skills: 'First Aid, Community Organizing',
      availability: 'Weekends',
      experience: '2 years volunteering with Red Cross',
      message: 'Eager to support mobile clinics.',
    };

    const res = await request(app).post('/api/v1/applications/volunteer/').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('new');
  });

  it('POST /api/v1/newsletter/subscribe/ subscribes an email', async () => {
    const res = await request(app)
      .post('/api/v1/newsletter/subscribe/')
      .send({ email: 'donor@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('donor@example.com');
  });
});

describe('Donations API', () => {
  it('POST /api/v1/donations/ creates payment session order', async () => {
    const payload = {
      amount: 1500,
      currency: 'INR',
      is_anonymous: false,
      donor_name: 'Anita Sahoo',
      donor_email: 'anita@example.com',
    };

    const res = await request(app).post('/api/v1/donations/').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.payment_session.order_id).toBeDefined();

    const donationId = res.body.data.id;
    const statusRes = await request(app).get(`/api/v1/donations/${donationId}/`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.amount).toBe(1500);
  });
});

describe('Authentication & Admin API', () => {
  it('POST /api/v1/accounts/auth/login/ logs in default admin', async () => {
    const res = await request(app).post('/api/v1/accounts/auth/login/').send({
      email: env.DEFAULT_ADMIN_EMAIL,
      password: env.DEFAULT_ADMIN_PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('access');
    expect(res.body.data).toHaveProperty('refresh');
    expect(res.body.data.user.email).toBe(env.DEFAULT_ADMIN_EMAIL);

    const token = res.body.data.access;

    // Test authenticated /me
    const meRes = await request(app)
      .get('/api/v1/accounts/me/')
      .set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(env.DEFAULT_ADMIN_EMAIL);
    expect(meRes.body.data.role).toBe('super_admin');
  });

  it('GET /api/v1/accounts/me/ rejects unauthorized request', async () => {
    const res = await request(app).get('/api/v1/accounts/me/');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('authentication_required');
  });
});
