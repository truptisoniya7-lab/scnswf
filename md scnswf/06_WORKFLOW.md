# System Workflow Document
## SCNSWF Website Rebuild

---

## 1. Visitor Workflow

1. Visitor lands on the site (Home) via direct URL, search engine, or social referral.
2. Visitor browses primary navigation (Home, About, Our Work, Impact, Get Involved, Contact).
3. Visitor views program details, impact statistics, stories, and gallery.
4. Visitor decides on an action: Donate, Volunteer, Intern, Partner, or Contact.
5. Visitor completes the relevant flow (see sections 3–7).
6. Visitor receives a confirmation (on-screen + email where applicable).

## 2. Navigation Workflow

1. Global navbar persists across all pages with primary nav items and primary CTAs (**Donate Now**, **Join Us**).
2. Mobile: navbar collapses into an accessible hamburger menu with focus-trap and keyboard support.
3. Footer provides secondary navigation: legal pages (Privacy Policy, Terms of Service, Refund/Donation Policy, Disclaimer), social links, contact info.
4. Breadcrumbs shown on nested pages (e.g., Program Detail) for orientation and SEO.
5. 404 page provides navigation back to Home/primary sections for any unmatched route.

## 3. Contact Workflow

1. Visitor opens Contact page, fills Contact Form (first_name, last_name, email, phone, subject, message, newsletter_subscription).
2. Frontend validates via Zod/React Hook Form; blocks submission on invalid input.
3. Frontend submits to `POST /api/v1/contact/`.
4. Backend validates via serializer, applies rate limiting, persists `ContactMessage` (status=`new`), optionally creates/updates a `NewsletterSubscriber` record if opted in.
5. Backend sends acknowledgment email to the visitor and a notification email/dashboard entry to admin staff.
6. Admin reviews message in dashboard, updates status (`new` → `read` → `responded`).

## 4. Volunteer Workflow

1. Visitor opens Volunteer page (Get Involved), reviews opportunities, fills Volunteer Application form.
2. Frontend validates required fields (name, email, phone, location, skills, availability, experience, message).
3. Submission → `POST /api/v1/applications/volunteer/`.
4. Backend validates, persists `VolunteerApplication` (status=`new`), sends confirmation email to applicant and notification to admin.
5. Admin reviews in dashboard, updates status (`new` → `in_review` → `accepted`/`rejected`), optionally contacts applicant directly (outside system, or via future email-template feature).

## 5. Internship Workflow

1. Visitor opens Internship page, fills Internship Application form including resume upload.
2. Frontend validates fields (name, email, phone, education, area_of_interest, duration, resume, message); resume validated for file type/size before upload.
3. Submission → `POST /api/v1/applications/internship/` (multipart/form-data).
4. Backend validates, uploads resume to a **private** Supabase Storage bucket, persists `InternshipApplication` with `resume_url` (backend-generated reference, not public), status=`new`.
5. Confirmation email to applicant; notification to admin.
6. Admin reviews application and resume (via backend-issued signed URL), updates status.

## 6. Partnership Workflow

1. Organization representative opens Partner page, fills Partnership Request form (organization_name, contact_person, email, phone, partnership_type, message).
2. Submission → `POST /api/v1/applications/partnership/`.
3. Backend validates, persists `PartnershipRequest` (status=`new`), sends confirmation + admin notification.
4. Admin reviews and updates status; approved partnerships are separately published as `Partner` records by a content editor once due diligence is complete (manual, intentional step — not automatic).

## 7. Donation Workflow

1. Visitor selects a donation amount (preset or custom) and, optionally, a specific program on the Donate page.
2. Visitor enters donor information or opts for an anonymous donation.
3. Frontend validates input, calls `POST /api/v1/donations/` to create a donation record and payment intent/order via the payment-service abstraction.
4. Backend creates `Donation` (status=`pending`) and initiates a provider order (`DonationTransaction`), returning checkout parameters.
5. Frontend redirects/opens the payment gateway's secure checkout using the returned session.
6. Payment gateway processes the payment and sends a **webhook** to `POST /api/v1/donations/webhook/{provider}/`.
7. Backend **verifies the webhook signature**, updates `DonationTransaction` and `Donation.status` (`succeeded`/`failed`), generates a `receipt_number` on success.
8. Backend sends a confirmation email with receipt details to the donor (if email provided) and updates the admin donation dashboard.
9. Frontend confirmation page reflects the **backend-verified** status (via polling or redirect callback plus a status-check call) — never trusts a client-side payment callback as the source of truth.

## 8. Admin Workflow

1. Admin authenticates at the admin login (JWT issued).
2. Dashboard presents summarized activity: new applications, new messages, recent donations, content awaiting publish.
3. Admin manages content entities (Programs, Impact, Stories, Gallery, Events, Partners, Team, Annual Reports, Homepage Content) — create/edit, then explicitly **publish/unpublish**.
4. Admin reviews and actions applications (Volunteer, Internship, Partnership) and Contact messages, updating status per section workflows above.
5. Admin reviews Donations (read-only for financial integrity; refunds handled via a controlled, logged action).
6. All state-changing admin actions are written to the Audit Log (actor, action, entity, timestamp).
7. Role-based permissions restrict which admin users can perform which actions (see `05_API_DOCUMENTATION.md`, section 13).

## 9. Content Publishing Workflow

1. Content editor creates/edits an entity (e.g., `Program`) with `status=draft`.
2. Draft content is visible only in the admin interface, never on public endpoints.
3. Editor reviews content for accuracy (per content rules — no invented statistics/testimonials/partners).
4. Editor sets `status=published` (and `published_at` for time-stamped content like stories).
5. Public API immediately reflects the change (no separate deploy required) — public endpoints only ever serve `status=published` records.
6. Editor can `archive` or revert to `draft` at any time to unpublish without deleting history.

## 10. Email Notification Workflow

| Trigger | Recipient(s) | Content |
|---|---|---|
| Contact form submitted | Visitor + Admin | Acknowledgment / new-message notification |
| Volunteer application submitted | Applicant + Admin | Confirmation / new-application notification |
| Internship application submitted | Applicant + Admin | Confirmation / new-application notification |
| Partnership request submitted | Requester + Admin | Confirmation / new-request notification |
| Donation succeeded | Donor (if email provided) + Admin | Receipt with amount, program, receipt number |
| Donation failed | Donor (if email provided) | Failure notice with retry guidance |
| Newsletter subscription | Subscriber | Subscription confirmation |

Emails are sent via a transactional email provider (see `03_TECH_STACK.md`), templated, and queued asynchronously if volume warrants introducing Celery (see `02_TECHNICAL_ARCHITECTURE.md`, section 3).

## 11. Error Workflow

1. **Client-side validation errors:** surfaced inline per field, submission blocked, no API call made.
2. **Server-side validation errors (400):** returned in the standard error envelope, mapped back to form fields by the frontend.
3. **Authentication/authorization errors (401/403):** admin UI redirects to login (401) or shows an access-denied state (403); public flows never require auth so these should not occur there.
4. **Rate limit errors (429):** frontend shows a "please try again shortly" message; backend logs repeated triggers for abuse monitoring.
5. **Unexpected errors (500):** backend logs full details internally (never exposed to the client), returns a generic safe error message; frontend shows a friendly fallback state with a retry option.
6. **Payment/webhook errors:** failed signature verification is rejected and logged as a security event (see `07_SECURITY.md`); processing failures are retried per the provider's webhook retry semantics and reconciled by comparing `DonationTransaction` records against provider dashboards.
