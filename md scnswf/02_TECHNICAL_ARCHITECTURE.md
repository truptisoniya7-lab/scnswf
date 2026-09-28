# Technical Architecture Document
## SCNSWF Website Rebuild

**Related Docs:** 01_PRD.md, 03_TECH_STACK.md, 04_DATABASE_DESIGN.md, 05_API_DOCUMENTATION.md, 07_SECURITY.md, 09_PROJECT_STRUCTURE.md, 10_DEPLOYMENT.md

---

## 1. System Architecture Overview

The system follows a **decoupled, API-first architecture**:

```
┌─────────────────────┐        HTTPS/REST        ┌──────────────────────┐        SQL         ┌───────────────────────┐
│  React + Vite (TS)  │  ────────────────────────▶ │ Django + DRF API     │ ──────────────────▶ │ Supabase PostgreSQL   │
│  Frontend (SPA)      │ ◀──────────────────────── │ (config/apps/*)      │ ◀────────────────── │ (production DB)       │
└─────────────────────┘        JSON responses       └──────────────────────┘                     └───────────────────────┘
         │                                                    │
         │  Static asset delivery (Vercel/CDN)                │  Object storage (files/images)
         ▼                                                    ▼
   Vercel / Static Host                                Supabase Storage
                                                                │
                                                                ▼
                                                     Payment Gateway (via
                                                     payment-service abstraction,
                                                     e.g. Razorpay) — webhooks
```

- The **frontend** is a statically-hosted single-page application (React Router client-side routing) that communicates with the backend exclusively via versioned REST endpoints (`/api/v1/`).
- The **backend** is a modular Django project exposing a DRF-based REST API, handling business logic, validation, authentication/authorization, and payment-webhook verification.
- The **database** is Supabase-hosted PostgreSQL, accessed by Django via its ORM using a standard PostgreSQL connection (not the Supabase client SDK), so Django retains full control of migrations, constraints, and query building.
- **Supabase Storage** holds all media/documents (gallery images, program images, annual reports, certificates); Django generates signed/controlled access URLs where documents are private.
- Frontend and backend are **independently deployable**.

## 2. Frontend Architecture

- **Pattern:** Component-based SPA with route-level code splitting.
- **Routing:** React Router, with lazy-loaded route components.
- **State:** Local component state by default; React Context only for cross-cutting concerns (auth/session, theme, toast/notification queue). No heavyweight global state library.
- **Data layer:** A dedicated `src/api/` layer wraps Axios/fetch calls; `src/services/` contains business-oriented service functions (e.g., `donationService`, `applicationService`) that call the API layer and normalize responses.
- **Forms:** React Hook Form + Zod schemas shared between form components and (mirrored) validation expectations on the backend.
- **Styling:** Tailwind CSS utility-first styling with a shared design-token configuration (see `08_UI_UX_DESIGN.md`).
- **Animation:** Framer Motion, used subtly (per design principles) — respects `prefers-reduced-motion`.

## 3. Backend Architecture

- **Framework:** Django + Django REST Framework, organized into domain-focused apps (see `09_PROJECT_STRUCTURE.md`).
- **Layering within each app:**
  - `models.py` — data layer (PostgreSQL via Django ORM).
  - `serializers.py` — validation + representation layer.
  - `services.py` (where logic is non-trivial) — business logic layer, kept out of views.
  - `views.py` / `viewsets.py` — thin controllers delegating to serializers/services.
  - `permissions.py` — RBAC and object-level permission classes.
  - `urls.py` — versioned routing, included under `/api/v1/`.
- **Authentication:** JWT (e.g., SimpleJWT) for admin/staff authentication; public endpoints (forms, program browsing) remain unauthenticated but rate-limited.
- **Background tasks:** Celery introduced only if a genuine async need arises (e.g., email sending at scale, receipt PDF generation) — not included by default to avoid over-engineering.
- **API docs:** Auto-generated OpenAPI/Swagger schema (e.g., drf-spectacular).

## 4. Database Architecture

- Supabase-provisioned PostgreSQL as the single production relational store.
- Schema designed and migrated via Django migrations (source of truth = Django models, not Supabase's own dashboard schema editor) to keep versioned, reviewable migrations.
- UUID primary keys for public-facing/externally-referenced entities; `created_at`/`updated_at` timestamps on all tables; foreign keys and indexes applied per `04_DATABASE_DESIGN.md`.
- Supabase's built-in row-level security (RLS) is **not** relied upon for authorization — the Django API is the sole authorization boundary, since all access goes through Django rather than directly from the frontend to Supabase.

## 5. API Architecture

- RESTful resource-oriented endpoints under `/api/v1/`.
- Consistent JSON envelope for success/error responses (see `05_API_DOCUMENTATION.md`).
- Pagination (page-number or cursor-based) on all list endpoints.
- Filtering/search via DRF filter backends on collection endpoints (programs, gallery, stories, events).
- Standard HTTP status code usage; structured validation error bodies.

## 6. Authentication Architecture

- **Public users:** No authentication required for browsing content or submitting public forms (contact, volunteer, internship, partnership, donation initiation). These endpoints are protected instead by rate limiting and input validation.
- **Admin/staff users:** JWT-based authentication (access + refresh tokens), issued at `/api/v1/accounts/auth/login/`. Tokens are short-lived; refresh tokens rotated and stored securely (httpOnly cookie preferred over localStorage for refresh tokens).
- **Authorization:** Role-based access control via Django groups/permissions and custom DRF permission classes (e.g., `IsAdminUser`, `IsContentEditor`).

## 7. Storage Architecture

- **Supabase Storage buckets**, separated by sensitivity/purpose, e.g.:
  - `public-gallery` — public images (gallery, programs, impact).
  - `public-partners` — partner/team logos and photos.
  - `private-documents` — annual reports, resumes, certificates (accessed via backend-generated signed URLs, not direct public links, where sensitivity requires it).
- Django backend performs upload validation (file type, size limits) before issuing storage write access, and never exposes the Supabase **service-role key** to the frontend. The frontend uploads either (a) directly via a short-lived signed upload URL issued by the backend, or (b) through the backend as a proxy — decided per endpoint sensitivity.

## 8. Deployment Architecture

- **Frontend:** Vercel (or equivalent static hosting) serving the built Vite bundle, with environment-specific `VITE_API_BASE_URL`.
- **Backend:** Render/Railway/AWS (or equivalent) running Django via Gunicorn behind HTTPS, with environment variables for all secrets (Supabase DB URL, Django secret key, JWT signing key, payment gateway keys).
- **Database/Storage:** Supabase-managed, with connection pooling (e.g., PgBouncer/Supabase pooler) for the Django ORM connection.
- **Domain:** `scnswf.org`, HTTPS enforced everywhere (HSTS), DNS pointing frontend and `api.scnswf.org` (or `/api` path via reverse proxy) to their respective hosts.

## 9. Data Flow (Representative: Donation)

1. Frontend collects donation amount, program, donor info → validates client-side (Zod).
2. Frontend calls `POST /api/v1/donations/` → Django validates, creates `Donation` (status=`pending`) and a `DonationTransaction` intent via the payment-service abstraction.
3. Backend returns a payment-session reference to the frontend; frontend redirects/opens the payment provider's checkout.
4. Payment gateway processes payment and sends a **webhook** to a dedicated backend endpoint.
5. Backend **verifies the webhook signature**, updates `DonationTransaction`/`Donation` status, generates a receipt, and triggers a confirmation email.
6. Frontend polls or is redirected to a confirmation page reflecting the verified status (never trusts client-side payment callbacks alone).

## 10. Component Relationships

- Frontend `pages/` compose `components/` and call `services/` → `api/` → Django REST endpoints.
- Django `views/viewsets` depend on `serializers` (validation/shape) and `services` (business rules) and `models` (persistence); `permissions` gate access at the view layer.
- Shared **API contract** (documented in `05_API_DOCUMENTATION.md`) is the binding interface between the two codebases, enabling independent development/deployment.

## 11. External Integrations

- **Payment gateway** (e.g., Razorpay) — integrated strictly behind a payment-service interface (`apps/donations/services/payment_provider.py`) so the concrete provider can be swapped without touching call sites.
- **Transactional email provider** (e.g., SMTP/SendGrid/SES) — for confirmations, receipts, and admin notifications.
- **Supabase Storage** — media/document storage as described above.

## 12. Scalability Strategy

- Stateless Django API processes behind a load balancer/host auto-scaling (horizontal scaling of Gunicorn workers).
- Database indexing on frequently queried fields (program slug, status fields, foreign keys, created_at for feeds).
- Pagination everywhere to bound response sizes.
- CDN-delivered static frontend assets and Supabase Storage objects.
- Modular Django apps allow extracting high-load domains (e.g., donations) into separate services later if needed.

## 13. Failure Handling

- Defined loading/empty/error states on every data-driven frontend view (see `08_UI_UX_DESIGN.md`, `11_TESTING_QA.md`).
- API returns structured error bodies with safe, non-leaking messages (see `07_SECURITY.md` — secure error messages).
- Payment webhook processing is idempotent (safe to receive duplicate webhook deliveries) and logged for reconciliation.
- Form submission failures preserve user input client-side and surface actionable validation messages.
- Global API error boundary in the frontend converts unexpected failures into a friendly fallback UI rather than a blank/crashed page.
