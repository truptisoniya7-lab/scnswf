# API Documentation
## SCNSWF Website Rebuild — REST API Specification

**Base URL (production):** `https://api.scnswf.org/api/v1/`
**Interactive docs:** `/api/v1/schema/swagger-ui/` (auto-generated via drf-spectacular)

---

## 1. API Architecture

- RESTful, resource-oriented endpoints, versioned under `/api/v1/`.
- JSON request/response bodies (`Content-Type: application/json`); file uploads use `multipart/form-data`.
- Consistent response envelope:

```json
// Success (single resource)
{ "data": { ... } }

// Success (list, paginated)
{
  "data": [ ... ],
  "meta": { "count": 120, "next": "...", "previous": null, "page_size": 20 }
}

// Error
{
  "error": {
    "code": "validation_error",
    "message": "One or more fields are invalid.",
    "details": { "email": ["Enter a valid email address."] }
  }
}
```

## 2. Authentication

- **Public endpoints:** No auth header required (rate-limited).
- **Admin endpoints:** `Authorization: Bearer <access_token>` (JWT).

| Endpoint | Method | Description |
|---|---|---|
| `/accounts/auth/login/` | POST | Obtain access + refresh token pair |
| `/accounts/auth/refresh/` | POST | Refresh access token |
| `/accounts/auth/logout/` | POST | Invalidate refresh token |
| `/accounts/me/` | GET | Current authenticated admin profile |

## 3. Public Content Endpoints

| Resource | Endpoint | Methods | Auth |
|---|---|---|---|
| Programs | `/programs/` | GET (list), GET `/programs/{slug}/` (detail) | Public |
| Program Services | `/programs/{slug}/services/` | GET | Public |
| Impact Metrics | `/impact/metrics/` | GET | Public |
| Impact Stories | `/impact/stories/` | GET (list), GET `/impact/stories/{slug}/` | Public |
| Gallery Albums | `/gallery/albums/` | GET (list), GET `/gallery/albums/{id}/` | Public |
| Gallery Images | `/gallery/albums/{id}/images/` | GET | Public |
| Events | `/events/` | GET (list), GET `/events/{slug}/` | Public |
| Partners | `/partners/` | GET | Public |
| Team Members | `/team/` | GET | Public |
| Annual Reports | `/documents/annual-reports/` | GET | Public |

All list endpoints support:
- **Pagination:** `?page=1&page_size=20`
- **Filtering:** e.g. `?status=published`, `?program=slug`
- **Search:** `?search=keyword` where applicable (programs, stories, events)
- **Ordering:** `?ordering=-created_at`

Only `status=published` records are ever returned on public endpoints, regardless of query parameters (enforced server-side, not client-controlled).

## 4. Form Submission Endpoints

| Resource | Endpoint | Method | Auth |
|---|---|---|---|
| Contact Message | `/contact/` | POST | Public (rate-limited) |
| Volunteer Application | `/applications/volunteer/` | POST | Public (rate-limited) |
| Internship Application | `/applications/internship/` | POST (multipart, resume) | Public (rate-limited) |
| Partnership Request | `/applications/partnership/` | POST | Public (rate-limited) |
| Newsletter Subscribe | `/newsletter/subscribe/` | POST | Public (rate-limited) |

**Example — Contact Form**

`POST /api/v1/contact/`

```json
{
  "first_name": "Anita",
  "last_name": "Sahoo",
  "email": "anita@example.com",
  "phone": "+91XXXXXXXXXX",
  "subject": "General Inquiry",
  "message": "I would like to know more about your mobile healthcare units.",
  "newsletter_subscription": true
}
```

Response `201 Created`:
```json
{ "data": { "id": "uuid", "status": "new", "created_at": "2026-01-01T10:00:00Z" } }
```

Validation error `400 Bad Request`:
```json
{ "error": { "code": "validation_error", "message": "One or more fields are invalid.", "details": { "email": ["Enter a valid email address."] } } }
```

## 5. Donation Endpoints

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/donations/` | POST | Create a donation + payment intent | Public (rate-limited) |
| `/donations/{id}/` | GET | Retrieve donation status (donor-facing, token-scoped) | Public (with access token from creation response) |
| `/donations/webhook/{provider}/` | POST | Payment provider webhook receiver | Provider signature verified, not user-authenticated |
| `/donations/` (admin) | GET | List all donations | Admin |
| `/donations/{id}/refund/` | POST | Trigger refund (admin action) | Admin |

**Create donation**

`POST /api/v1/donations/`
```json
{
  "program_id": "uuid | null",
  "amount": 2500.00,
  "currency": "INR",
  "is_anonymous": false,
  "donor_name": "Anita Sahoo",
  "donor_email": "anita@example.com",
  "donor_phone": "+91XXXXXXXXXX"
}
```

Response `201 Created`:
```json
{
  "data": {
    "id": "uuid",
    "status": "pending",
    "payment_session": { "provider": "razorpay", "order_id": "order_xxx", "checkout_params": { "...": "..." } }
  }
}
```

Webhook processing verifies the provider signature, is idempotent per `provider_payment_id`, and updates `Donation.status` and `DonationTransaction` accordingly (see `02_TECHNICAL_ARCHITECTURE.md`, section 9).

## 6. Admin/CMS Endpoints (Authenticated)

All admin endpoints live under the same resource paths with full CRUD, gated by JWT + role-based permissions:

| Resource | Endpoints | Methods |
|---|---|---|
| Programs | `/admin/programs/`, `/admin/programs/{id}/` | GET, POST, PUT/PATCH, DELETE |
| Program Services | `/admin/programs/{id}/services/` | GET, POST, PUT/PATCH, DELETE |
| Impact Metrics | `/admin/impact/metrics/` | Full CRUD |
| Impact Stories | `/admin/impact/stories/` | Full CRUD |
| Gallery Albums/Images | `/admin/gallery/albums/`, `/admin/gallery/albums/{id}/images/` | Full CRUD |
| Events | `/admin/events/` | Full CRUD |
| Partners | `/admin/partners/` | Full CRUD |
| Team Members | `/admin/team/` | Full CRUD |
| Volunteer Applications | `/admin/applications/volunteer/`, `/{id}/status/` | GET (list/detail), PATCH (status) |
| Internship Applications | `/admin/applications/internship/`, `/{id}/status/` | GET (list/detail), PATCH (status) |
| Partnership Requests | `/admin/applications/partnership/`, `/{id}/status/` | GET (list/detail), PATCH (status) |
| Contact Messages | `/admin/contact/`, `/{id}/status/` | GET (list/detail), PATCH (status) |
| Donations | `/admin/donations/` | GET (list/detail), POST `/refund/` |
| Documents / Annual Reports | `/admin/documents/`, `/admin/annual-reports/` | Full CRUD |
| Homepage Content | `/admin/homepage/` | GET, PUT |
| Audit Log | `/admin/audit-log/` | GET (read-only) |

Write operations (POST/PUT/PATCH/DELETE) on admin endpoints require the caller's role to include the corresponding permission (e.g., `content_editor` for CMS content, `applications_reviewer` for application status changes, `super_admin` for all).

## 7. Request/Response Schemas

Full request/response JSON Schemas for every endpoint are generated automatically from DRF serializers via `drf-spectacular` and published at `/api/v1/schema/` (raw OpenAPI 3 document) and `/api/v1/schema/swagger-ui/` (interactive). This document describes representative examples; the OpenAPI schema is the authoritative, always-current contract.

## 8. Validation Errors

All validation failures return `400 Bad Request` with the error envelope shown in section 1, `details` keyed by field name, mirroring DRF serializer `.errors` output.

## 9. HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success (GET, PATCH, PUT) |
| 201 | Resource created (POST) |
| 204 | Success, no content (DELETE) |
| 400 | Validation error |
| 401 | Missing/invalid authentication |
| 403 | Authenticated but not authorized (RBAC) |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate unique field) |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error (logged, safe generic message returned) |

## 10. Pagination

Page-number pagination by default:
```
GET /api/v1/programs/?page=2&page_size=20
```
Response `meta` includes `count`, `next`, `previous`, `page_size`. High-traffic feeds (e.g., stories, events) may adopt cursor pagination later without breaking the response envelope contract.

## 11. Filtering

Declarative filtering via `django-filter` `FilterSet` classes per resource (e.g., `Program`: `status`, `search`; `Donation` admin list: `status`, `program`, `date_from`, `date_to`). Only fields explicitly declared on a resource's `FilterSet` are filterable — arbitrary field filtering is disabled to prevent data exposure.

## 12. Authentication Requirements Summary

| Endpoint Group | Requires Auth |
|---|---|
| Public content (programs, impact, gallery, events, partners, team, reports) | No |
| Form submissions (contact, volunteer, internship, partnership, newsletter) | No (rate-limited) |
| Donation creation & webhook | No (webhook verified via provider signature) |
| Donation status lookup by donor | Scoped access token from creation response |
| All `/admin/*` endpoints | Yes — JWT + role-based permission |

## 13. Authorization Requirements Summary

| Role | Permissions |
|---|---|
| `super_admin` | Full access to all admin endpoints, including user/role management and audit log. |
| `content_editor` | CRUD on Programs, Impact, Gallery, Events, Partners, Team, Homepage Content, Documents/Annual Reports. No access to Donations or application PII beyond assigned scope. |
| `applications_reviewer` | Read/status-update access to Volunteer, Internship, Partnership applications and Contact messages. No access to content-management or donation endpoints. |
