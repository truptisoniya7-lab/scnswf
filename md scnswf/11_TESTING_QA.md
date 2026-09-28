# Testing & QA Strategy
## SCNSWF Website Rebuild

---

## 1. Unit Testing

- **Frontend:** Vitest + React Testing Library for components, hooks, and utility functions. Target: all `services/`, `utils/`, and form-validation logic covered; key components (forms, cards, navigation) covered for rendering and interaction.
- **Backend:** `pytest-django` (or Django `TestCase`) for model validation/constraints, serializer validation logic, and service-layer business rules (e.g., payment-service abstraction, receipt number generation).

## 2. Integration Testing

- **Backend:** Full request/response cycle tests via DRF `APIClient` for each endpoint group (public content, forms, donations, admin CRUD), asserting status codes, response envelope shape, and permission enforcement.
- **Cross-system:** Donation flow tested end-to-end against a mocked/sandboxed payment provider, including webhook signature verification and idempotency (duplicate webhook delivery handled correctly).

## 3. API Testing

- Contract testing against the generated OpenAPI schema (e.g., `schemathesis`) to catch schema drift between documentation and implementation.
- Explicit tests for every documented error case in `05_API_DOCUMENTATION.md` (400 validation, 401/403 auth, 404, 429 rate limit).

## 4. Frontend Testing

- Component-level tests for all form components (validation states, submission states, error rendering).
- Route-level smoke tests ensuring every primary navigation page renders without error.
- Visual/responsive spot-checks across the defined breakpoints (Mobile, Tablet, Laptop, Desktop, Large Desktop).

## 5. Form Testing

- Every form (Contact, Volunteer, Internship, Partnership, Donation) tested for: required-field enforcement, format validation (email, phone), file-type/size validation (resume upload), successful submission path, and server-error handling path.
- Spam/abuse protection (rate limiting) verified with repeated-submission tests.

## 6. Security Testing

- Automated dependency vulnerability scans (CI-integrated).
- Manual/automated checks for: CORS misconfiguration, missing security headers, JWT expiry/refresh correctness, RBAC boundary tests (each role attempting out-of-scope actions and receiving 403).
- Webhook endpoint tested against invalid/forged signatures (must be rejected).
- File upload endpoint tested against disallowed file types and oversized files.

## 7. Responsive Testing

- Manual and automated (e.g., Playwright viewport emulation) checks at each breakpoint for layout integrity, navigation usability, and touch-target sizing on mobile.

## 8. Accessibility Testing

- Automated: axe-core integrated into component/E2E tests to catch contrast, ARIA, and semantic issues.
- Manual: full keyboard-only navigation pass on every primary flow (navigation, all forms, donation flow); screen reader spot-check (e.g., NVDA/VoiceOver) on the homepage and one full form flow.
- Verified against WCAG 2.2 AA success criteria relevant to a content + forms + payments site.

## 9. Performance Testing

- Lighthouse CI run against key pages (Home, Program Detail, Donate, Impact) on every release candidate, targeting the scores defined in `01_PRD.md`.
- Backend load-testing (e.g., `locust`/`k6`) on the donation-creation and public list endpoints to validate pagination and indexing hold up under realistic concurrent load.

## 10. Browser Testing

- Cross-browser pass on latest stable Chrome, Firefox, Safari, and Edge; mobile Safari (iOS) and Chrome (Android) explicitly checked given mobile-first priority.

## 11. UAT (User Acceptance Testing)

- Staging environment walkthrough with SCNSWF stakeholders covering: content accuracy, donation flow (sandbox payments), all four application forms, and admin CMS usability by a non-technical staff member.
- UAT sign-off required before production release, checked against the Acceptance Criteria in `01_PRD.md`.

## 12. Regression Testing

- Full automated suite (unit + integration + key E2E flows) run in CI on every PR to `main`.
- A maintained E2E smoke suite (Playwright) covering the critical paths (donation, volunteer application, internship application, partnership request, contact) run before every production deploy.

## 13. Release Checklist

- [ ] All CI checks passing (lint, type-check, unit, integration, migration-check).
- [ ] E2E smoke suite passing against staging.
- [ ] Accessibility audit passed on primary flows.
- [ ] Security checklist reviewed (headers, CORS, rate limits, webhook verification, secrets not committed).
- [ ] Performance audit meets target scores on key pages.
- [ ] SEO metadata present on all pages (titles, descriptions, OG tags, sitemap, robots.txt).
- [ ] All environment variables documented and set in the production environment.
- [ ] No fake/placeholder production data remains; all placeholders clearly marked or replaced with verified content.
- [ ] No console errors on any primary page.
- [ ] No broken links (automated link-check pass).
- [ ] UAT sign-off obtained from SCNSWF stakeholders.
- [ ] Rollback plan confirmed (previous frontend/backend releases deployable on short notice).
