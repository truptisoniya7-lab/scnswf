# Development Roadmap
## SCNSWF Website Rebuild

This roadmap follows the `ai_agent_execution_order` defined in the project specification and elaborates each phase into concrete deliverables.

---

## Phase 1 — Setup & Discovery

- Inspect and analyze `https://www.scnswf.org/` (content, structure, forms, workflows).
- Identify content categories, gaps, and technical requirements for the rebuild.
- Generate all `/docs` documentation files (this set) and review for contradictions.
- Initialize repository structure (`frontend/`, `backend/`, `docs/`, `database/`, `scripts/`, `.github/`).
- **Deliverable:** Approved `/docs` documentation set; scaffolded repo.

## Phase 2 — UI Foundation

- Configure React + Vite + TypeScript, Tailwind CSS, ESLint/Prettier.
- Build the design-system primitives (`components/ui/`) per `08_UI_UX_DESIGN.md`.
- Build layout shell (Navbar, Footer, PageLayout) and routing skeleton (React Router) with lazy-loaded route stubs for every page in the information architecture.
- **Deliverable:** Navigable, unstyled-to-styled shell of the full site with placeholder content.

## Phase 3 — Backend Foundation

- Configure Django + Django REST Framework project (`config/`), environment-based settings (`dev`/`production`).
- Scaffold all apps listed in `09_PROJECT_STRUCTURE.md` with empty models.
- Configure `django-cors-headers`, JWT auth (SimpleJWT), and `drf-spectacular`.
- **Deliverable:** Running Django project with health-check endpoint and empty app structure.

## Phase 4 — Database

- Implement all models per `04_DATABASE_DESIGN.md`; generate and review migrations.
- Configure Supabase PostgreSQL connection (`DATABASE_URL`) and connection pooling.
- Run initial migrations against a dev Supabase project; seed minimal placeholder data for local development.
- **Deliverable:** Fully migrated schema matching the database design doc.

## Phase 5 — API Integration

- Implement serializers, viewsets, permissions, and URLs for all public content endpoints (Programs, Impact, Gallery, Events, Partners, Team, Documents/Annual Reports) per `05_API_DOCUMENTATION.md`.
- Wire the frontend `api/` and `services/` layers to consume these endpoints; replace placeholder content with live data.
- **Deliverable:** All public pages rendering real (seeded) data end-to-end.

## Phase 6 — Forms

- Implement Contact, Volunteer, Internship (with resume upload), and Partnership endpoints (backend) and forms (frontend) per `01_PRD.md` field specs and `06_WORKFLOW.md`.
- Implement client + server validation, rate limiting, and confirmation/notification email sending.
- **Deliverable:** All four public forms fully functional end-to-end, including email notifications.

## Phase 7 — Donation System

- Implement `Donation`/`DonationTransaction` models, payment-service abstraction interface, and a sandbox integration with the chosen provider (e.g., Razorpay test mode).
- Implement donation creation, checkout redirect, webhook receiver with signature verification, receipt generation, and confirmation email.
- Implement the frontend Donate page (preset/custom amount, program selection, donor info, anonymous option) and confirmation page.
- **Deliverable:** Full donation flow working end-to-end in sandbox mode.

## Phase 8 — Admin / CMS

- Implement admin authentication (JWT login/refresh/logout) and role-based permission classes.
- Implement admin CRUD endpoints and frontend admin UI for all CMS-managed entities (`06_WORKFLOW.md`, section 8–9): Programs, Impact, Stories, Gallery, Events, Partners, Team, Annual Reports, Homepage Content.
- Implement application/message review screens (Volunteer, Internship, Partnership, Contact) with status workflows.
- Implement donation admin view (read-only + controlled refund action) and the Audit Log viewer.
- **Deliverable:** Fully functional admin dashboard covering every CMS capability in `01_PRD.md`, section 6.4.

## Phase 9 — Testing

- Execute the full testing strategy in `11_TESTING_QA.md`: unit, integration, API/contract, form, security, responsive, accessibility, performance, browser testing.
- Fix all critical and high-severity issues found.
- **Deliverable:** Passing automated test suite; completed accessibility, security, and performance audits.

## Phase 10 — Deployment

- Configure production environments per `10_DEPLOYMENT.md` (Vercel frontend, Django host backend, Supabase production project, domain/DNS/HTTPS).
- Set up CI/CD pipelines (GitHub Actions) for both frontend and backend.
- Run the full Release Checklist (`11_TESTING_QA.md`, section 13).
- Go live on `scnswf.org`.
- **Deliverable:** Production deployment live, monitored, with rollback plan verified.

## 11. Post-Launch Hardening (Continuous)

- Monitor error tracking (Sentry), uptime, and Lighthouse CI on an ongoing basis.
- Address any residual accessibility, security, or performance findings from real-world usage.
- Fix all critical issues identified post-launch before considering each release cycle closed.

## 12. README & Handover

- Update `README.md` with complete setup instructions: prerequisites, local development setup (frontend + backend + Supabase), environment variable reference (pointing to `.env.example`), running tests, and deployment overview.
- Produce the final implementation checklist confirming every item in `01_PRD.md` (Acceptance Criteria) and `11_TESTING_QA.md` (Release Checklist) is complete.

## Definition of Done

A phase (and the project overall) is considered done when:
1. All functionality specified for that phase is implemented and matches the corresponding `/docs` file.
2. Automated tests for the phase's scope pass in CI.
3. No secrets are committed; environment variables are documented.
4. No invented statistics, testimonials, partners, or legal claims are present — placeholders are clearly marked wherever verified content is pending.
5. Accessibility, security, and performance requirements relevant to the phase are met or explicitly tracked as follow-up with justification.
6. Documentation in `/docs` is updated to reflect any implementation decisions that diverged from the original plan, keeping `/docs` synchronized with the codebase as the source of truth.
