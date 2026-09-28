# Security Architecture Document
## SCNSWF Website Rebuild

---

## 1. Threat Model (Summary)

| Asset | Threats | Primary Mitigations |
|---|---|---|
| Donor PII & payment data | Interception, leakage, fraud | HTTPS, no raw card storage, webhook signature verification, least-privilege access |
| Applicant PII (resumes, contact info) | Unauthorized access, leakage | Private storage buckets, RBAC, no public API exposure of applications |
| Admin accounts | Credential theft, brute force, privilege escalation | JWT expiry/rotation, rate limiting, RBAC, audit logging |
| Public API | Abuse (spam, scraping, DoS) | Rate limiting, input validation, pagination limits |
| Secrets (DB creds, JWT keys, payment keys) | Exposure via source control or client bundle | Environment variables, secret scanning, never shipped to frontend |
| Database | Injection, unauthorized queries | ORM parameterization, least-privilege DB roles |

## 2. Authentication

- Admin/staff authentication via JWT (short-lived access token, longer-lived rotating refresh token).
- Passwords hashed with Django's default strong hashing (PBKDF2/Argon2); never stored or logged in plaintext.
- Refresh tokens stored in httpOnly, `Secure`, `SameSite=Strict` cookies where feasible, to reduce XSS-based token theft.
- No authentication required for public browsing or form submission endpoints — these rely on rate limiting and validation instead.

## 3. Authorization (RBAC)

- Roles: `super_admin`, `content_editor`, `applications_reviewer` (see `05_API_DOCUMENTATION.md`, section 13).
- DRF permission classes enforce role checks at the view/viewset level; object-level checks applied where a role should only act on a subset of records.
- Principle of least privilege: no role has broader access than its function requires (e.g., `content_editor` cannot view donation or application PII).

## 4. JWT Security

- Short access-token TTL (e.g., 15 minutes) with refresh rotation (e.g., 7 days, rotated on use, old refresh token invalidated — refresh-token reuse detection recommended).
- Tokens signed with a dedicated, environment-variable-stored signing key, separate from `SECRET_KEY`.
- Token payload contains only non-sensitive claims (user id, role) — never PII.

## 5. CSRF

- Since the API is JWT-authenticated (bearer token, not session cookie, for admin API calls), CSRF risk is minimal for those calls; Django's CSRF middleware remains enabled for any cookie-based/session-based surface (e.g., Django Admin itself, if used internally) and for the refresh-token cookie flow, using `SameSite` cookie attributes plus Django's CSRF token mechanism where cookies participate in state-changing requests.

## 6. CORS

- `django-cors-headers` configured with an explicit **allow-list** of origins (production frontend domain, staging domain, local dev origin) — never a wildcard `*` in production.
- Only required methods/headers permitted; credentials (`Access-Control-Allow-Credentials`) enabled only for the specific origins that need cookie-based auth flows.

## 7. XSS Prevention

- React's default JSX escaping prevents most injection; any `dangerouslySetInnerHTML` usage (e.g., rendering admin-authored rich text) is sanitized server- or client-side with a vetted sanitizer before render.
- Backend applies output encoding consistent with DRF's JSON rendering (no raw HTML echoing of user input).
- Strict Content-Security-Policy header restricts script sources.

## 8. SQL Injection Prevention

- All database access goes through the Django ORM with parameterized queries; no raw SQL string interpolation of user input. Any unavoidable raw SQL uses parameterized cursors exclusively.

## 9. Rate Limiting

- DRF throttling classes (or `django-ratelimit`) applied to: form submission endpoints, donation creation, login endpoint, and any public search/filter endpoint.
- Stricter limits on login (brute-force protection) than on general browsing endpoints.
- 429 responses returned with a clear, safe message; repeated violations logged for review.

## 10. File Upload Security

- Allowed file types enforced by extension **and** MIME-type/content sniffing (not trusted from the client alone) — e.g., resumes limited to PDF/DOC/DOCX.
- File size limits enforced server-side (e.g., resumes ≤ 5MB, images ≤ 10MB) in addition to any frontend limit.
- Uploaded files are stored in Supabase Storage under backend-controlled paths; filenames are sanitized/regenerated (e.g., UUID-based) to avoid path traversal or collision.
- Private buckets (resumes, internal documents) are never directly publicly listable; access is via backend-issued signed URLs with short expiry.

## 11. Payment Security

- No raw payment card data ever touches SCNSWF's servers — payment collection happens on the provider's hosted checkout/SDK.
- Payment provider integration is isolated behind a `payment_provider` service interface (see `02_TECHNICAL_ARCHITECTURE.md`), keeping provider credentials and logic out of general application code.
- **Webhook signature verification is mandatory** on every incoming webhook before any `Donation`/`DonationTransaction` state change is applied.
- Webhook processing is idempotent (keyed on `provider_payment_id`) to safely handle duplicate deliveries.
- Donation amounts are validated/re-derived server-side; the client never dictates a "paid" status directly.

## 12. Secrets Management

- All secrets (Django `SECRET_KEY`, JWT signing key, database URL, Supabase service-role key, payment provider keys, email provider credentials) are supplied via environment variables, documented (names only, no values) in `.env.example`.
- Secrets are never committed to Git; `.gitignore` excludes `.env` and any local secret files.
- The Supabase **service-role key** is used only on the backend server and is never sent to, or embedded in, the frontend bundle.
- Production `DEBUG=False` at all times; debug/error pages never leak stack traces or secrets to end users.

## 13. Database Security

- Django connects to Supabase PostgreSQL over an encrypted (TLS) connection.
- Database credentials scoped to a role with only the privileges the application needs (no superuser usage by the app connection where avoidable).
- Regular automated backups (Supabase-managed) and a documented restore procedure.

## 14. API Security

- All traffic served over HTTPS only; HTTP requests redirected.
- Secure HTTP response headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Content-Security-Policy`.
- Consistent, safe error responses (see below) with no internal detail leakage.
- Explicit field-level filtering (see `05_API_DOCUMENTATION.md`) to prevent unintended data exposure via query parameters.

## 15. Admin Security

- Admin endpoints require JWT auth and role-based permission; sensitive admin surfaces are additionally rate-limited on login.
- No default/shared admin credentials — accounts provisioned individually.
- Session/token invalidation on logout and on password change.
- Optional recommendation: enforce MFA for `super_admin` accounts in a later phase.

## 16. Privacy

- Only necessary personal information is collected per form (see `01_PRD.md`, section 8).
- Donor, volunteer, intern, and partner-application information is never exposed via public API endpoints — only accessible through authenticated, role-scoped admin endpoints.
- Published legal pages: Privacy Policy, Terms of Service, Refund/Donation Policy, Disclaimer — describing what is collected, why, retention, and contact for data requests.
- Data retention/soft-deletion approach documented in `04_DATABASE_DESIGN.md`; deletion requests are handled by an admin-triggered hard-delete process where legally required, separate from routine soft-delete status flags.

## 17. Audit Logging

- A dedicated `AuditLog` entity records: `actor_user_id`, `action` (create/update/delete/status_change/publish/unpublish/refund), `entity_type`, `entity_id`, `timestamp`, and a summary of the change.
- Audit log is append-only and readable only by `super_admin`.
- Login attempts (success/failure) are logged for security monitoring, without storing plaintext credentials.

## 18. Secure Error Messages

- User-facing error messages are generic and non-revealing ("Something went wrong. Please try again.") for unexpected (500-class) failures.
- Validation errors are specific enough to be actionable (field-level) without revealing internal system details.
- Full stack traces and internal exception details are logged server-side only (e.g., to Sentry) and never returned in API responses in production.

## 19. Dependency Vulnerability Monitoring

- Automated dependency scanning in CI (e.g., `npm audit`/Dependabot for frontend, `pip-audit`/Dependabot for backend).
- Dependencies pinned via lockfiles (`package-lock.json`, `requirements.txt`/`poetry.lock`); upgrades reviewed and tested before merge.

## 20. Incident Response

1. **Detect** — via monitoring/error tracking (Sentry), audit log anomalies, or user report.
2. **Contain** — rotate affected secrets/tokens, disable compromised accounts, block abusive IPs at the rate-limiter/WAF level if applicable.
3. **Assess** — determine scope of data potentially affected (which entities, how many records).
4. **Remediate** — patch the vulnerability, deploy fix, verify via testing.
5. **Notify** — inform affected users/donors and relevant authorities if legally required, per the organization's privacy policy commitments.
6. **Review** — post-incident review documented internally; update this security document and relevant controls.
