# Technology Stack Specification
## SCNSWF Website Rebuild

---

## 1. Frontend Technologies

| Category | Choice | Rationale |
|---|---|---|
| Framework | React 18+ | Mature ecosystem, component reuse, strong hiring/maintenance pool. |
| Build Tool | Vite | Fast dev server/HMR, optimized production builds, first-class React+TS support. |
| Language | TypeScript | Type safety across forms, API contracts, and shared data models reduces runtime bugs. |
| Routing | React Router | De-facto standard client-side routing with lazy-loading support. |
| Styling | Tailwind CSS | Utility-first, consistent design tokens, small production CSS via purge. |
| Animation | Framer Motion | Declarative, accessible (respects reduced-motion), used sparingly per design principles. |
| Icons | Lucide React | Lightweight, consistent, accessible SVG icon set. |
| Forms | React Hook Form | Performant, minimal re-renders, integrates cleanly with Zod. |
| Validation | Zod | Shared schema-driven validation; type inference for TS. |
| API Client | Axios (preferred) or native fetch | Interceptors for auth headers, consistent error handling. |
| State Management | React Context (scoped) | Avoids unnecessary global-state complexity for a mostly content-driven site. |
| Charts | Recharts | Declarative charts for impact visualizations. |

## 2. Backend Technologies

| Category | Choice | Rationale |
|---|---|---|
| Framework | Django | Batteries-included, strong ORM, admin, security defaults. |
| API Layer | Django REST Framework | Industry-standard REST toolkit: serializers, viewsets, permissions, pagination. |
| Language | Python 3.11+ | Long-term support, performance improvements, broad library support. |
| Authentication | JWT (e.g., `djangorestframework-simplejwt`) | Stateless auth suited to a decoupled SPA frontend. |
| Validation | DRF serializers/validators | Centralized, testable request validation. |
| API Documentation | drf-spectacular (OpenAPI/Swagger) | Auto-generated, always-current API docs. |
| Background Tasks | Celery (conditional) | Only introduced if a genuine async workload (bulk email, PDF generation) emerges. |
| App Server | Gunicorn | Production-grade WSGI server for Django. |
| CORS | django-cors-headers | Controlled cross-origin access from the Vercel-hosted frontend. |

## 3. Database

| Category | Choice | Rationale |
|---|---|---|
| Engine | PostgreSQL (via Supabase) | Relational integrity, strong indexing/constraint support, managed hosting. |
| Access Pattern | Django ORM over standard PostgreSQL connection | Keeps Django migrations as schema source of truth; avoids dual-schema drift with Supabase client SDK. |
| Connection Pooling | Supabase pooler (PgBouncer) | Handles connection limits under serverless/scaled backend deployments. |

## 4. Storage

| Category | Choice | Rationale |
|---|---|---|
| Object Storage | Supabase Storage | Integrated with the same Supabase project; supports public/private buckets, signed URLs. |
| Access Pattern | Backend-mediated (signed URLs / proxy) | Prevents exposing the Supabase service-role key to the frontend. |

## 5. Authentication

| Category | Choice | Rationale |
|---|---|---|
| Admin Auth | JWT (access + refresh) | Stateless, scalable, works cleanly with a decoupled SPA. |
| Session Storage | httpOnly cookie for refresh token (preferred) | Mitigates XSS token theft compared to localStorage. |
| Public Endpoints | Unauthenticated + rate-limited | Public forms/browsing require no login, but are protected against abuse. |

## 6. API Tools

- **drf-spectacular** — OpenAPI schema generation and Swagger/Redoc UI.
- **django-filter** — declarative filtering for list endpoints.
- **DRF pagination classes** — consistent page-number/cursor pagination.
- **django-ratelimit** or DRF throttling classes — rate limiting on public/form endpoints.

## 7. Testing Tools

| Layer | Tool |
|---|---|
| Frontend unit/component | Vitest + React Testing Library |
| Frontend E2E | Playwright (or Cypress) |
| Backend unit/integration | Django `TestCase` / `pytest-django` |
| API testing | DRF `APIClient` / pytest-django + `schemathesis` (schema-based fuzz testing, optional) |
| Accessibility | axe-core (automated) + manual keyboard/screen-reader checks |
| Performance | Lighthouse CI |

## 8. Deployment

| Layer | Choice |
|---|---|
| Frontend hosting | Vercel (or equivalent static/edge host) |
| Backend hosting | Render / Railway / AWS (Django-compatible) |
| Database/Storage | Supabase (managed) |
| Domain | `scnswf.org`, HTTPS enforced |
| CI/CD | GitHub Actions (`.github/workflows/`) for lint, test, build, deploy |

## 9. Monitoring

- **Error tracking:** Sentry (frontend + backend) recommended for production error visibility.
- **Uptime monitoring:** Third-party uptime checker (e.g., UptimeRobot) on the public site and API health endpoint.
- **Logging:** Structured backend logging (JSON logs) shippable to the hosting provider's log aggregation.
- **Performance monitoring:** Lighthouse CI in the deployment pipeline; Web Vitals reporting from the frontend (optional, privacy-respecting).

## 10. Development Tools

- **Linting/Formatting:** ESLint + Prettier (frontend), Ruff/Flake8 + Black (backend).
- **Type Checking:** `tsc --noEmit` in CI (frontend), `mypy` optional (backend).
- **Git Hooks:** Husky + lint-staged (frontend) / pre-commit (backend) to block bad commits.
- **Environment Management:** `.env` files (never committed) with `.env.example` as the documented template.
- **API Client Generation (optional):** OpenAPI-generated TypeScript types from the DRF schema to keep frontend/backend contracts in sync.

## 11. Dependency Rationale

Every dependency listed above was selected to satisfy an explicit requirement in `01_PRD.md` (forms, validation, animation, charts, auth, API docs, testing, deployment) — no speculative libraries are included. Celery is intentionally **excluded by default** per the "do not over-engineer simple features" development rule, and is only added if a genuine asynchronous workload is identified during implementation.
