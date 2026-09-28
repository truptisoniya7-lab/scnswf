# Deployment Documentation
## SCNSWF Website Rebuild

---

## 1. Environment Variables

### Frontend (`frontend/.env.example`)
```
VITE_API_BASE_URL=https://api.scnswf.org/api/v1
VITE_ENV=production
```

### Backend (`backend/.env.example`)
```
DJANGO_SECRET_KEY=
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=api.scnswf.org
DATABASE_URL=postgresql://<user>:<password>@<supabase-host>:<port>/<db>?sslmode=require
JWT_SIGNING_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET_PUBLIC=public-gallery
SUPABASE_STORAGE_BUCKET_PRIVATE=private-documents
PAYMENT_PROVIDER=razorpay
PAYMENT_PROVIDER_KEY_ID=
PAYMENT_PROVIDER_KEY_SECRET=
PAYMENT_WEBHOOK_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=True
CORS_ALLOWED_ORIGINS=https://www.scnswf.org,https://scnswf.org
SENTRY_DSN=
```

No secret **values** are committed — only this documented list of required variable **names** lives in version control (`.env.example`).

## 2. Frontend Deployment

1. Push to the `main` branch (or merge a release PR) triggers CI.
2. CI runs lint, type-check (`tsc --noEmit`), unit tests, and production build (`vite build`).
3. On success, deploy the `dist/` output to Vercel (or equivalent static host), with `VITE_API_BASE_URL` set per environment (preview/staging/production).
4. Vercel preview deployments are generated automatically for pull requests for review before merge.

## 3. Backend Deployment

1. CI runs lint (Ruff/Flake8), tests (`pytest`), and a migration check (`python manage.py makemigrations --check`).
2. Build a container image (or use the host's native Python buildpack) running Gunicorn: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`.
3. Deploy to Render/Railway/AWS with environment variables injected via the platform's secret management (never baked into the image).
4. Run `python manage.py migrate` as a release/pre-deploy step against the target environment's database.
5. Run `python manage.py collectstatic --noinput` for Django-served static assets (admin, API docs UI) if applicable.

## 4. Supabase Configuration

- Dedicated Supabase project per environment (or clearly separated schemas) for staging vs. production to avoid cross-contamination of test data.
- Database connection string (with SSL required) supplied to Django via `DATABASE_URL`.
- Connection pooling (Supabase pooler/PgBouncer) enabled for the backend's database connection, sized to the expected concurrent worker count.
- Row-level security left in its default-safe state; Django (service-role/backend) is the sole authorized writer, since the frontend never talks to Supabase directly.

## 5. Storage Configuration

- Buckets created per `04_DATABASE_DESIGN.md`/`07_SECURITY.md`: `public-gallery`, `public-partners`, `private-documents` (naming illustrative — final names finalized during implementation).
- Public buckets: read-only public access; writes only via the authenticated backend.
- Private buckets: no public access; backend issues short-lived signed URLs for legitimate access (e.g., admin viewing a resume).

## 6. Domain Configuration

- `scnswf.org` / `www.scnswf.org` → frontend host (Vercel), via DNS `A`/`CNAME` records per the host's instructions.
- `api.scnswf.org` (or a `/api` reverse-proxy path on the same domain) → backend host.
- SSL certificates auto-provisioned/renewed by the hosting platforms (Vercel, and Render/Railway's managed TLS, or via a load balancer with ACM if AWS is used).

## 7. HTTPS

- HTTPS enforced everywhere; HTTP requests redirected to HTTPS at the platform/load-balancer level.
- `Strict-Transport-Security` header set with a long `max-age` and `includeSubDomains` once HTTPS is verified stable across all subdomains.

## 8. CORS Production Configuration

- `CORS_ALLOWED_ORIGINS` restricted to `https://www.scnswf.org` and `https://scnswf.org` (plus staging domain in the staging environment) — no wildcard in production.

## 9. Database Migrations

- Migrations are generated locally/in a feature branch, committed alongside model changes, and peer-reviewed in the PR.
- Applied automatically as a release step in CI/CD against staging first, verified, then promoted to production using the same reviewed migration set.
- Rollback plan: maintain reversible migrations where practical; for non-reversible changes, follow the expand-and-contract pattern (see `04_DATABASE_DESIGN.md`, section 9).

## 10. Build Process

- **Frontend:** `npm ci` → `npm run lint` → `npm run typecheck` → `npm run test` → `npm run build`.
- **Backend:** `pip install -r requirements.txt` → `ruff check .` → `pytest` → `python manage.py makemigrations --check` → `python manage.py migrate` (deploy step) → `gunicorn` start.

## 11. CI/CD

- GitHub Actions workflows in `.github/workflows/`:
  - `frontend-ci.yml` — lint/typecheck/test/build on every PR.
  - `backend-ci.yml` — lint/test/migration-check on every PR.
  - `deploy-frontend.yml` — deploy on merge to `main` (or tagged release).
  - `deploy-backend.yml` — deploy + migrate on merge to `main` (or tagged release).
- Branch protection requires CI to pass before merge to `main`.

## 12. Rollback Strategy

- **Frontend:** redeploy the previous known-good build (Vercel retains prior deployments; instant rollback via the platform's dashboard/CLI).
- **Backend:** redeploy the previous container/release artifact; if a migration must be reverted, apply the corresponding reverse migration only after confirming no destructive, already-applied data loss (favor expand-and-contract to keep rollbacks safe).
- Incident-driven rollbacks follow the process in `07_SECURITY.md`, section 20 (Incident Response) where the rollback is security-related.
