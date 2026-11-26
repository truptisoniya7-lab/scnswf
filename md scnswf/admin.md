# Admin Panel Spec

Project: SCNSWF web app (healthcare and social welfare NGO, Bhubaneswar)
Frontend: React + Vite + TypeScript. Backend: Node.js + Express. Database: Firebase (Firestore). See section 6a for Firestore notes.
Auth: same passwordless email OTP as login, with role-based access.
Route prefix: `/admin`

---

## 1. Goal

A secure admin area where authorized staff manage everything on the platform:

- Users (interns, donors, volunteers)
- Donations
- Applications (internship and volunteer)
- Website content (programs, events, gallery, news, testimonials)

Extras: dashboard stats, CSV export, audit log and email notifications.

---

## 2. Access and Roles

Admins sign in through the normal `/login` OTP flow. The backend returns the user's `systemRole`, and the frontend routes `admin` and `superadmin` users to `/admin`.

| System role | Access |
|-------------|--------|
| `user` | Public site and `/profile` only |
| `staff` | Dashboard, view and edit users, donations, applications and content. Cannot delete, change system roles or view the audit log. |
| `superadmin` | Everything, including deleting records, managing staff accounts and the audit log |

- `systemRole` is separate from the registration role (`internship`, `donor`, `volunteer`). A person can be a donor and also staff.
- Only a `superadmin` can promote a user to `staff` or `superadmin`. Seed the first `superadmin` directly in the database, never through the UI.
- Route guard: `RequireRole(['staff','superadmin'])`. Non-admins visiting `/admin` see a 403 page, not a redirect loop.
- All permission checks are enforced on the backend. The frontend only hides UI.

---

## 3. Visual Design

Reuse the green design tokens from `register.md`, but make the admin panel denser and calmer: it is a work tool, not a landing page.

- Dark green theme: page `#04140c`, panels `rgba(10,42,26,0.6)` with a 1px `rgba(110,231,183,0.14)` border, accent `#34d399`.
- Light blur on panels only (`backdrop-filter: blur(10px)`). No drifting background blobs in the admin area.
- Layout: fixed left sidebar (collapsible to icons, drawer on mobile) plus a top bar with page title, search and the user menu.
- Tables: sticky header, 44px rows, hover highlight, status shown as colored pills.
- Motion: only short transitions (150-250ms) for drawers, modals and toasts. Respect `prefers-reduced-motion`.
- Minimum supported width: 360px. Tables scroll horizontally on mobile, or switch to cards for the main lists.

### Sidebar navigation

1. Dashboard
2. Users
3. Applications
4. Donations
5. Content (Programs, Events, Gallery, News, Testimonials)
6. Audit Log (superadmin only)
7. Settings (superadmin only)

---

## 4. Pages and Features

### 4.1 Dashboard (`/admin`)
- Stat cards: total users, new users this month, pending applications, donations this month (amount and count).
- Charts: registrations over time (line, 30 or 90 days), users by registration role (donut), donations per month (bar).
- Recent activity: last 10 audit entries and the 5 newest pending applications.
- Date range filter: 7 days, 30 days, 90 days, custom.

### 4.2 Users (`/admin/users`)
- Table columns: name, email, phone, registration role, system role (staff only visible to superadmin), email verified, status, created date.
- Search by name, email or phone. Filters: registration role, status (`active`, `suspended`), verified.
- Sorting on any column. Server-side pagination (25 per page).
- Row click opens a detail drawer: full profile, role-specific fields, linked applications and donations.
- Actions: edit details, change registration role, suspend or reactivate, delete (superadmin only, with a confirm dialog), change system role (superadmin only).
- Suspended users cannot log in. Their active sessions are revoked.

### 4.3 Applications (`/admin/applications`)
- Types: `internship`, `volunteer`. Tabs or a type filter.
- Statuses: `pending`, `under_review`, `approved`, `rejected`.
- Table: applicant, type, submitted date, status, reviewer.
- Detail view: applicant info, submitted answers, internal notes (admin only), status history.
- Actions: change status, add a note, approve or reject. Rejecting requires a reason.
- Bulk actions: select multiple and approve, reject or export.
- Status changes trigger an email to the applicant (see section 8).

### 4.4 Donations (`/admin/donations`)
- Table: donor (user or guest), amount, currency (INR default), date, payment method, status (`pending`, `completed`, `failed`, `refunded`), reference ID.
- Filters: status, date range, amount range, donor. Search by reference ID or donor email.
- Detail view: payment details, receipt, notes.
- Actions: mark as completed or refunded (manual entries, for example cash or bank transfer), add a manual donation record, resend the receipt email, download the receipt PDF.
- Summary strip above the table: total amount and count for the current filter.
- Payment gateway data is read-only. Never edit amounts on gateway-confirmed payments.

### 4.5 Website Content (`/admin/content`)
Manage the content shown on the public site. Each type has a list page and a create/edit form.

| Type | Fields |
|------|--------|
| Programs | title, slug, summary, description (rich text), cover image, category (mobile health units, maternal care, skill development, community), status (`draft`, `published`) |
| Events | title, date and time, location, description, cover image, registration link, status |
| Gallery | image upload, caption, album or category, display order |
| News | title, slug, body (rich text), cover image, publish date, status |
| Testimonials | name, role, quote, photo, status |

- Draft and published states. Only published items appear on the public site.
- Image upload: JPG, PNG or WebP, max 5 MB, validated on the server, resized and compressed. Alt text is required.
- Rich text editor: TipTap (headings, bold, italic, lists, links, images). Sanitize the HTML on the server.
- Drag-to-reorder for gallery and featured items.
- Live preview before publishing.

### 4.6 Audit Log (`/admin/audit`, superadmin only)
- Records every create, update, delete, status change, login to admin and role change.
- Columns: time, actor, action, entity type, entity ID, summary.
- Detail view shows before and after values for edits.
- Filters: actor, action, entity type, date range. Read-only and not deletable from the UI.

### 4.7 Settings (`/admin/settings`, superadmin only)
- Manage staff: invite by email, change role, deactivate.
- Email templates (application approved, application rejected, donation receipt) with a preview.
- Site settings: contact details and donation page text.

---

## 5. Data Models (TypeScript)

```ts
type RegistrationRole = 'internship' | 'donor' | 'volunteer';
type SystemRole = 'user' | 'staff' | 'superadmin';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  registrationRole: RegistrationRole;
  systemRole: SystemRole;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id: string;
  userId: string;
  type: 'internship' | 'volunteer';
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  answers: Record<string, unknown>;
  rejectionReason?: string;
  reviewerId?: string;
  notes: { id: string; authorId: string; text: string; createdAt: string }[];
  statusHistory: { status: string; changedBy: string; at: string }[];
  createdAt: string;
}

interface Donation {
  id: string;
  userId?: string;            // null for guest donors
  donorName: string;
  donorEmail: string;
  amount: number;             // in paise to avoid float errors
  currency: 'INR';
  method: 'online' | 'cash' | 'bank_transfer' | 'cheque';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference?: string;
  receiptNo?: string;
  createdAt: string;
}

interface ContentItem {
  id: string;
  type: 'program' | 'event' | 'gallery' | 'news' | 'testimonial';
  title: string;
  slug?: string;
  body?: string;              // sanitized HTML
  coverImageUrl?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  order?: number;
  data: Record<string, unknown>; // type-specific fields
  createdAt: string;
  updatedAt: string;
}

interface AuditEntry {
  id: string;
  actorId: string;
  action: string;             // e.g. 'application.approve'
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  ip?: string;
  createdAt: string;
}
```

Store money as integers in paise. Use UTC timestamps and show them in IST in the UI.

---

## 6. API Contract (Express)

All routes live under `/api/admin`, require authentication and are checked with `requireRole`. Lists accept `page`, `pageSize`, `q`, `sort` and filter query params and return `{ data: T[], page, pageSize, total }`. Errors use `{ error: { code, message } }`.

| Area | Endpoints | Roles |
|------|-----------|-------|
| Stats | `GET /stats/overview`, `GET /stats/registrations`, `GET /stats/donations` | staff+ |
| Users | `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `POST /users/:id/suspend`, `POST /users/:id/reactivate` | staff+ |
| Users | `DELETE /users/:id`, `PATCH /users/:id/system-role` | superadmin |
| Applications | `GET /applications`, `GET /applications/:id`, `PATCH /applications/:id/status`, `POST /applications/:id/notes`, `POST /applications/bulk` | staff+ |
| Donations | `GET /donations`, `GET /donations/:id`, `POST /donations` (manual), `PATCH /donations/:id/status`, `POST /donations/:id/resend-receipt` | staff+ |
| Content | `GET/POST /content/:type`, `GET/PATCH /content/:type/:id`, `POST /content/:type/reorder` | staff+ |
| Content | `DELETE /content/:type/:id` | superadmin |
| Uploads | `POST /uploads/image` | staff+ |
| Export | `GET /export/:entity.csv` (honors current filters) | staff+ |
| Audit | `GET /audit`, `GET /audit/:id` | superadmin |
| Settings | `GET/PATCH /settings`, `GET/POST /staff`, `PATCH /staff/:id` | superadmin |

Public site endpoints (`GET /api/content/:type`) return only `published` items and are cached.

### 6a. Firestore Notes

Express talks to Firestore through the Firebase Admin SDK. The browser never writes to admin collections directly, and Firestore security rules deny all client access to them.

- Collections: `users`, `applications`, `donations`, `content`, `auditLog`, `settings`, `emailLog`.
- Pagination: use cursor-based paging (`startAfter`) instead of page numbers. The API can still accept `page` and translate it for small lists, or return a `nextCursor` token. The "total" count uses a `count()` aggregation query.
- Search: Firestore has no full-text search. For name, email or phone search, use prefix queries on lowercase fields (`nameLower`, `emailLower`), or add Algolia or Typesense later if search needs to be richer.
- Filters and sorts that combine fields need composite indexes. Define them in `firestore.indexes.json`.
- Dashboard stats: keep running counters in a `stats` document updated in transactions or Cloud Functions, instead of counting thousands of documents on every page load.
- Audit log and status history: write them in the same batch or transaction as the change so they cannot drift apart.
- Roles: set `systemRole` as a Firebase custom claim as well as in the `users` document, and verify it with the Admin SDK on every request.
- Images: upload to Firebase Storage, with admin-only write rules. Store the download URL on the content item.
- CSV export: stream the results in batches (for example 500 documents per read) to stay within memory limits.

---

## 7. CSV Export

- Every list page has an **Export CSV** button that exports the current filters, not just the visible page.
- Streamed from the server, with a row cap (for example 50,000) and an audit entry for each export.
- Escape cells that start with `=`, `+`, `-` or `@` (CSV injection protection).
- Filename format: `scnswf-users-2026-11-21.csv`.
- Exports containing personal data are limited to `staff` and `superadmin`.

---

## 8. Email Notifications

Sent from the backend with a transactional email service (Resend, Brevo, SES or Nodemailer with SMTP). Emails go through a queue with retries.

| Trigger | Recipient |
|---------|-----------|
| Application approved | Applicant |
| Application rejected (includes the reason) | Applicant |
| Donation completed, with receipt | Donor |
| Staff invited | Invitee |
| New application submitted | Admin notification address (configurable) |

- Templates are editable in Settings, with variables such as `{{name}}` and `{{amount}}`.
- Each send is logged (success or failure) and visible on the related record.
- Respect unsubscribe for non-essential emails. Transactional emails are always sent.

---

## 9. Frontend Structure

```
src/
  admin/
    AdminLayout.tsx            // sidebar, topbar, outlet
    routes.tsx
    pages/
      Dashboard/
      Users/ (UsersList.tsx, UserDrawer.tsx)
      Applications/ (ApplicationsList.tsx, ApplicationDetail.tsx)
      Donations/ (DonationsList.tsx, DonationDetail.tsx, ManualDonationForm.tsx)
      Content/ (ContentList.tsx, ContentEditor.tsx, GalleryManager.tsx)
      AuditLog/
      Settings/
    components/
      DataTable.tsx            // server-side pagination, sort, filters
      FilterBar.tsx
      StatCard.tsx
      StatusPill.tsx
      ConfirmDialog.tsx
      RichTextEditor.tsx
      ImageUploader.tsx
      ExportButton.tsx
    hooks/ (useAdminQuery.ts, usePermissions.ts)
    api/ (typed clients per entity)
  routes/RequireRole.tsx
```

- Data fetching: TanStack Query with typed API clients, with cache invalidation after mutations.
- Forms: `react-hook-form` with `zod`, validated again on the server.
- Charts: Recharts.
- Toasts for success and errors. Confirm dialogs for destructive actions.
- Permission helper: `can('users.delete')` drives which buttons render.

---

## 10. Security Checklist

- Every admin endpoint checks role on the server, never trust the frontend.
- Short-lived access tokens or httpOnly session cookies, with CSRF protection for cookie sessions.
- Rate limit all admin endpoints and OTP requests. Re-prompt OTP for sensitive actions (delete user, change system role) if the session is older than 15 minutes.
- Validate and sanitize all input. Sanitize rich-text HTML on the server.
- File uploads: check real MIME type and size, store outside the web root or in object storage, generate new file names.
- Audit log every write and every export. The audit log is append-only.
- Personal data (phone, email) is visible to staff only, and never included in public API responses.
- Soft-delete users and donations where possible so that records stay consistent. Hard delete is superadmin only.
- Security headers (`helmet`), CORS limited to the site origin.
- Admin pages set `noindex`.

---

## 11. Build Order

1. Backend: `systemRole` on users, `requireRole` middleware, audit-log helper.
2. Admin layout, route guard and 403 page.
3. Users list, detail drawer and actions.
4. Applications list and review flow, with emails.
5. Donations list, manual entry and receipts.
6. Content management (start with News and Programs, then Events, Gallery and Testimonials).
7. Dashboard stats and charts.
8. CSV export and the audit log page.
9. Settings: staff management and email templates.
10. Testing, accessibility and security pass.

---

## 12. Acceptance Criteria

- [ ] Only `staff` and `superadmin` can reach `/admin`. Everyone else gets a 403.
- [ ] Staff cannot delete records, change system roles or open the audit log, enforced by the API as well as the UI.
- [ ] Users, applications, donations and content can be listed, searched, filtered, sorted and paginated server-side.
- [ ] Application status changes are recorded in history and trigger the right email.
- [ ] Manual donations can be added, and receipts can be downloaded and resent.
- [ ] Content created as draft is hidden from the public site until published.
- [ ] The dashboard shows correct totals and charts for the selected date range.
- [ ] CSV export respects the active filters and escapes formula characters.
- [ ] Every write and export appears in the audit log with actor and timestamp.
- [ ] The dark green UI works at 360px and on desktop, with reduced-motion support.
- [ ] Destructive actions always ask for confirmation.
