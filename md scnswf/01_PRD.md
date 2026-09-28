# Product Requirements Document (PRD)
## Suresh Chandra Nayak Social Welfare Foundation (SCNSWF) — Website Rebuild

**Document Owner:** Engineering / Product
**Status:** Draft v1.0
**Related Docs:** 02_TECHNICAL_ARCHITECTURE.md, 03_TECH_STACK.md, 04_DATABASE_DESIGN.md, 05_API_DOCUMENTATION.md, 06_WORKFLOW.md, 07_SECURITY.md, 08_UI_UX_DESIGN.md

---

## 1. Project Overview

SCNSWF is a healthcare and social welfare NGO based in Bhubaneswar, Odisha, India, operating at `scnswf.org`. This project is a **complete, production-grade rebuild** of the organization's public website and supporting backend systems, replacing the current site with a modern, trustworthy, accessible, secure, and scalable platform.

The rebuild uses:
- **Frontend:** React + Vite (TypeScript)
- **Backend:** Django + Django REST Framework (DRF)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage

The existing website (`https://www.scnswf.org/`) is used strictly as a **functional and content reference** — not a design reference. Legitimate organizational information and required functionality are preserved; the visual design is rebuilt to a cleaner, modern, premium, accessible standard.

## 2. Business Objectives

1. Establish a credible, professional digital presence that reflects SCNSWF's healthcare and social welfare mission.
2. Increase donor trust and donation conversion through a transparent, secure donation experience.
3. Simplify volunteer, intern, and partner onboarding via structured application workflows.
4. Give non-technical staff full content control (programs, impact stats, stories, gallery, events, partners, team, reports) through an admin/CMS layer.
5. Improve discoverability (SEO) and reach across devices (mobile-first responsive design).
6. Meet accessibility (WCAG 2.2 AA) and security best practices appropriate for a platform handling donor and applicant PII.
7. Build a maintainable, modular codebase that can scale as programs and content grow.

## 3. Target Users

| User Type | Description |
|---|---|
| **Site Visitors / General Public** | People researching the NGO, its programs, and impact. |
| **Prospective Donors** | Individuals or organizations wanting to donate to specific programs or the general fund. |
| **Prospective Volunteers** | Individuals applying to volunteer, including skill-based volunteering. |
| **Prospective Interns** | Students/early-career professionals applying for internships. |
| **Corporate / Institutional Partners** | Organizations seeking CSR partnerships or in-kind support. |
| **Journalists / Researchers / Grant Bodies** | Users seeking verified impact data, annual reports, and organizational legitimacy. |
| **Admin / Staff Users** | Internal staff managing content, applications, donations, and reports via the CMS. |

## 4. User Personas

**Persona 1 — "Anita, the Donor" (32, urban professional)**
Wants to donate quickly and securely, understand exactly where her money goes, and receive a receipt. Trust signals (transparency, legitimacy, past impact) are critical to her decision.

**Persona 2 — "Rahul, the Volunteer Applicant" (24, recent graduate)**
Wants to understand available volunteering opportunities, see time commitment expectations, and apply with minimal friction on mobile.

**Persona 3 — "Priya, the CSR Manager" (40, corporate partnerships lead)**
Needs credible impact data, past partnership examples, and a clear partnership inquiry channel to evaluate SCNSWF as a CSR partner.

**Persona 4 — "Admin Staff Member" (NGO operations staff, limited technical background)**
Needs a simple, low-friction admin interface to update programs, publish stories, upload gallery images, and review incoming applications/donations without developer assistance.

## 5. User Journeys

1. **Visitor → Program Discovery → Donation**
   Home → Programs → Program Detail → Donate → Amount & Program Selection → Donor Info → Payment → Confirmation/Receipt.

2. **Visitor → Volunteer Application**
   Home/Get Involved → Volunteer → Application Form → Submission → Confirmation Email → Admin Review.

3. **Visitor → Internship Application**
   Get Involved → Internship → Application Form (with resume upload) → Submission → Confirmation → Admin Review.

4. **Organization → Partnership Inquiry**
   Get Involved → Partner → Partnership Request Form → Submission → Admin Follow-up.

5. **Admin → Content Management**
   Login → Dashboard → Manage Programs/Impact/Stories/Gallery/Events/Partners/Team/Reports → Publish/Unpublish → Review Applications/Donations/Messages.

## 6. Functional Requirements

### 6.1 Public Website
- Fully responsive multi-page site covering: Home, About, Our Work/Programs, Impact, Get Involved, Contact, Donate, Volunteer, Partnerships, Internship, Gallery, Stories of Change, Privacy Policy, Terms of Service, Refund/Donation Policy, Disclaimer.
- Program detail pages with services, geographic coverage, and impact.
- Impact page with statistics, geographic reach, program-wise impact, stories, and annual reports.
- Gallery with albums and images.
- Stories of Change (impact narratives).

### 6.2 Forms
- Contact Form, Volunteer Application, Internship Application (with resume upload), Partnership Request — field sets as defined in `04_DATABASE_DESIGN.md` / source specification.
- Client-side validation (Zod + React Hook Form) and server-side validation (DRF serializers).

### 6.3 Donation System
- Preset and custom donation amounts, program selection, donor info capture, anonymous donation option.
- Payment-provider-agnostic abstraction (no hardcoded provider; Razorpay or equivalent integrated later via a payment-service interface).
- Donation status tracking, receipt generation, confirmation email, admin donation records.

### 6.4 CMS / Admin
- Admin-manageable: Programs, Impact statistics, Stories, Gallery, Events, Partners, Team members, Annual reports, Volunteer/Internship/Partnership applications, Contact messages, Donations, Homepage content.
- Role-based access control for admin operations.
- Audit logging of content and record changes.

### 6.5 Non-Functional Requirements
- **Performance:** Lighthouse 90+ where realistic; good Core Web Vitals; mobile-first performance priority.
- **Accessibility:** WCAG 2.2 AA target.
- **SEO:** Unique titles/meta per page, Open Graph, structured data, sitemap, robots.txt.
- **Security:** See `07_SECURITY.md` — HTTPS-only, CSRF/XSS/SQLi prevention, rate limiting, secure secrets management, payment webhook verification.
- **Scalability:** Modular Django apps, indexed PostgreSQL schema, stateless API layer, independently deployable frontend/backend.
- **Reliability:** Defined error, loading, and empty states across all pages; graceful failure handling for forms and payments.

## 7. Page Requirements

Pages and their required sections are defined in `website_information_architecture` and elaborated in `08_UI_UX_DESIGN.md`. Every page must include: SEO metadata, accessible semantic structure, responsive layout, and a clear CTA path (Donate or Join Us) where relevant.

## 8. Form Requirements

| Form | Required Fields |
|---|---|
| Contact Form | first_name, last_name, email, phone, subject, message, newsletter_subscription |
| Volunteer Application | name, email, phone, location, skills, availability, experience, message |
| Internship Application | name, email, phone, education, area_of_interest, duration, resume, message |
| Partnership Request | organization_name, contact_person, email, phone, partnership_type, message |

All forms must validate on client and server, sanitize input, and prevent spam/abuse (rate limiting, honeypot/captcha consideration).

## 9. Donation Requirements

- Payment-service abstraction layer (no hardcoded provider lock-in).
- Donation intent/order creation before payment.
- Secure webhook verification for payment confirmation.
- Auto-generated receipts and confirmation emails.
- Admin visibility into all donation records and statuses.

## 10. Admin Requirements

- Secure authenticated admin access (JWT-based where applicable) with role-based permissions.
- Dashboard for reviewing and managing all CMS entities listed in section 6.4.
- Ability to publish/unpublish content without a deploy.
- Audit log of key admin actions.

## 11. Acceptance Criteria

- All primary navigation pages render correctly across mobile, tablet, laptop, desktop, and large-desktop breakpoints.
- All forms submit successfully, validate correctly, and produce the expected confirmation and admin-side record.
- Donation flow completes end-to-end against the payment abstraction layer (sandbox/mock initially).
- Admin can create/edit/publish all CMS-managed content types.
- No secrets are committed to source control; all secrets are environment-variable driven.
- Accessibility audit passes WCAG 2.2 AA on primary user flows.
- Lighthouse performance/SEO/accessibility/best-practices scores meet the targets in `03_TECH_STACK.md`/performance requirements where realistically achievable.
- No invented statistics, testimonials, partners, or legal claims appear anywhere in shipped content — placeholders are used and clearly marked where verified content is unavailable.

## 12. Out of Scope (Initial Release)

- Multi-language / i18n support (unless later requested).
- Native mobile applications.
- Live chat / chatbot support.
- Advanced donor CRM / recurring-donation subscription billing (beyond basic recurring flag if defined later).
- Public-facing donor leaderboard or social sharing gamification.

## 13. Future Scope

- Recurring/subscription donations.
- Multi-language support (e.g., Odia, Hindi).
- Volunteer hour tracking and certificates.
- Advanced analytics dashboard for impact reporting.
- Integration with a full donor CRM.
- Push/email marketing automation for newsletter subscribers.
