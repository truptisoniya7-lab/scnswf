# Database Design Document
## SCNSWF Website Rebuild — Supabase PostgreSQL

---

## 1. Design Principles

- UUID primary keys (`uuid`, default `gen_random_uuid()`) on all externally-referenced/public entities.
- Every table includes `created_at` and `updated_at` (`timestamptz`, auto-managed).
- Foreign keys enforced at the database level with appropriate `ON DELETE` behavior (`CASCADE`, `SET NULL`, or `RESTRICT` per relationship semantics below).
- Indexes on foreign keys, slugs, status/enum fields used in filtering, and any field used in list-endpoint search.
- No duplicate/denormalized data unless justified by read-performance needs (none currently justified).
- Soft deletion (`is_deleted` / `deleted_at`) applied only to entities with a business need to preserve history: `Donation`, `VolunteerApplication`, `InternshipApplication`, `PartnershipRequest`, `ContactMessage`. Content entities (Program, Gallery, etc.) use a `status` field (`draft`/`published`/`archived`) instead of soft deletion.
- Passwords are **never stored in plaintext** — Django's default PBKDF2/Argon2 password hashing is used for the `User` model.
- No raw payment card data is ever stored — only payment-provider references/tokens.

## 2. Entity List

`User`, `AdminProfile`, `Program`, `ProgramService`, `ImpactMetric`, `ImpactStory`, `GalleryAlbum`, `GalleryImage`, `Event`, `Partner`, `TeamMember`, `VolunteerApplication`, `InternshipApplication`, `PartnershipRequest`, `ContactMessage`, `Donation`, `DonationTransaction`, `Document`, `AnnualReport`, `NewsletterSubscriber`.

## 3. Table Definitions

### 3.1 `User` (Django auth user, extended)
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| email | citext, unique | Login identifier |
| password | varchar | Hashed (never plaintext) |
| first_name | varchar(100) | |
| last_name | varchar(100) | |
| is_staff | boolean | Django admin/staff flag |
| is_active | boolean | |
| role | varchar(30) | enum: `super_admin`, `content_editor`, `applications_reviewer` |
| created_at / updated_at | timestamptz | |

### 3.2 `AdminProfile`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → User, unique) | one-to-one |
| phone | varchar(20) | |
| avatar_url | text | Supabase Storage reference |
| created_at / updated_at | timestamptz | |

### 3.3 `Program`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| slug | varchar(160), unique, indexed | URL identifier |
| title | varchar(200) | |
| summary | text | |
| description | text | |
| problem_addressed | text | |
| geographical_coverage | text | |
| cover_image_url | text | |
| status | varchar(20), indexed | `draft` / `published` / `archived` |
| display_order | integer | |
| created_at / updated_at | timestamptz | |

### 3.4 `ProgramService`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| program_id | UUID (FK → Program, CASCADE), indexed | |
| title | varchar(200) | |
| description | text | |
| display_order | integer | |
| created_at / updated_at | timestamptz | |

### 3.5 `ImpactMetric`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| program_id | UUID (FK → Program, SET NULL, nullable), indexed | Optional program-specific metric |
| label | varchar(150) | e.g. "Patients served" |
| value | numeric | |
| unit | varchar(30) | e.g. "people", "camps" |
| period_start / period_end | date, nullable | |
| created_at / updated_at | timestamptz | |

### 3.6 `ImpactStory`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| slug | varchar(160), unique, indexed | |
| title | varchar(200) | |
| summary | text | |
| body | text | |
| program_id | UUID (FK → Program, SET NULL, nullable), indexed | |
| cover_image_url | text | |
| status | varchar(20), indexed | `draft` / `published` |
| published_at | timestamptz, nullable | |
| created_at / updated_at | timestamptz | |

### 3.7 `GalleryAlbum`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| title | varchar(200) | |
| description | text | |
| status | varchar(20), indexed | `draft` / `published` |
| created_at / updated_at | timestamptz | |

### 3.8 `GalleryImage`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| album_id | UUID (FK → GalleryAlbum, CASCADE), indexed | |
| image_url | text | Supabase Storage reference |
| caption | varchar(255) | |
| alt_text | varchar(255) | Required for accessibility |
| display_order | integer | |
| created_at / updated_at | timestamptz | |

### 3.9 `Event`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| slug | varchar(160), unique, indexed | |
| title | varchar(200) | |
| description | text | |
| location | varchar(255) | |
| start_datetime | timestamptz, indexed | |
| end_datetime | timestamptz | |
| status | varchar(20), indexed | `draft` / `published` / `cancelled` |
| created_at / updated_at | timestamptz | |

### 3.10 `Partner`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar(200) | |
| logo_url | text | |
| website_url | text, nullable | |
| partnership_type | varchar(50) | e.g. `csr`, `institutional`, `government` |
| status | varchar(20), indexed | `draft` / `published` |
| display_order | integer | |
| created_at / updated_at | timestamptz | |

### 3.11 `TeamMember`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar(150) | |
| role_title | varchar(150) | |
| bio | text | |
| photo_url | text | |
| category | varchar(30) | `leadership` / `team` |
| status | varchar(20), indexed | `draft` / `published` |
| display_order | integer | |
| created_at / updated_at | timestamptz | |

### 3.12 `VolunteerApplication`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar(150) | |
| email | varchar(255), indexed | |
| phone | varchar(20) | |
| location | varchar(255) | |
| skills | text | |
| availability | varchar(100) | |
| experience | text | |
| message | text | |
| status | varchar(20), indexed | `new` / `in_review` / `accepted` / `rejected` |
| is_deleted | boolean, default false | Soft delete |
| created_at / updated_at | timestamptz | |

### 3.13 `InternshipApplication`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar(150) | |
| email | varchar(255), indexed | |
| phone | varchar(20) | |
| education | varchar(255) | |
| area_of_interest | varchar(150) | |
| duration | varchar(100) | |
| resume_url | text | Supabase Storage (private bucket) |
| message | text | |
| status | varchar(20), indexed | `new` / `in_review` / `accepted` / `rejected` |
| is_deleted | boolean, default false | |
| created_at / updated_at | timestamptz | |

### 3.14 `PartnershipRequest`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| organization_name | varchar(255) | |
| contact_person | varchar(150) | |
| email | varchar(255), indexed | |
| phone | varchar(20) | |
| partnership_type | varchar(50) | |
| message | text | |
| status | varchar(20), indexed | `new` / `in_review` / `accepted` / `rejected` |
| is_deleted | boolean, default false | |
| created_at / updated_at | timestamptz | |

### 3.15 `ContactMessage`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| first_name | varchar(100) | |
| last_name | varchar(100) | |
| email | varchar(255), indexed | |
| phone | varchar(20) | |
| subject | varchar(255) | |
| message | text | |
| newsletter_subscription | boolean, default false | |
| status | varchar(20), indexed | `new` / `read` / `responded` |
| is_deleted | boolean, default false | |
| created_at / updated_at | timestamptz | |

### 3.16 `Donation`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| program_id | UUID (FK → Program, SET NULL, nullable), indexed | Null = general fund |
| donor_name | varchar(150), nullable | Null if anonymous |
| donor_email | varchar(255), nullable, indexed | |
| donor_phone | varchar(20), nullable | |
| is_anonymous | boolean, default false | |
| amount | numeric(12,2) | |
| currency | varchar(10), default `INR` | |
| status | varchar(20), indexed | `pending` / `succeeded` / `failed` / `refunded` |
| receipt_number | varchar(50), unique, nullable | |
| is_deleted | boolean, default false | |
| created_at / updated_at | timestamptz | |

### 3.17 `DonationTransaction`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| donation_id | UUID (FK → Donation, CASCADE), indexed | |
| provider | varchar(30) | e.g. `razorpay` |
| provider_order_id | varchar(150), indexed | |
| provider_payment_id | varchar(150), nullable, indexed | |
| provider_signature | varchar(255), nullable | For webhook verification audit |
| raw_payload | jsonb | Stored provider payload for reconciliation |
| status | varchar(20), indexed | Mirrors provider transaction status |
| created_at / updated_at | timestamptz | |

### 3.18 `Document`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| title | varchar(200) | |
| category | varchar(50) | e.g. `certificate`, `policy`, `report` |
| file_url | text | Supabase Storage reference |
| visibility | varchar(20) | `public` / `private` |
| created_at / updated_at | timestamptz | |

### 3.19 `AnnualReport`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| year | integer, unique, indexed | |
| title | varchar(200) | |
| file_url | text | |
| status | varchar(20), indexed | `draft` / `published` |
| created_at / updated_at | timestamptz | |

### 3.20 `NewsletterSubscriber`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| email | varchar(255), unique, indexed | |
| subscribed_at | timestamptz | |
| is_active | boolean, default true | |
| created_at / updated_at | timestamptz | |

## 4. Relationships Summary

- `Program` 1—N `ProgramService`, `ImpactMetric`, `ImpactStory`, `Donation`.
- `GalleryAlbum` 1—N `GalleryImage`.
- `Donation` 1—N `DonationTransaction`.
- `AdminProfile` 1—1 `User`.

## 5. Indexing Strategy

- All foreign key columns indexed.
- All `slug`, `email`, and `status` columns used in filtering/search indexed.
- Composite index candidates: `Donation(status, created_at)` for admin dashboard queries; `ImpactStory(status, published_at)` for public feeds.

## 6. Constraints

- `NOT NULL` on all required business fields per the field tables above.
- `UNIQUE` constraints on `slug`, `email` (per subscriber/user context), `receipt_number`, `AnnualReport.year`.
- `CHECK` constraint on `Donation.amount > 0`.
- Foreign key `ON DELETE` behavior chosen per relationship to avoid orphaned or unintentionally cascaded records (see column notes above).

## 7. Normalization

Schema is normalized to 3NF: no repeating groups, all non-key attributes depend only on the primary key, and lookup-style data (services, metrics, images) is factored into child tables rather than embedded/duplicated JSON blobs — except `DonationTransaction.raw_payload`, which intentionally stores the raw provider payload (jsonb) for audit/reconciliation purposes only, not as a substitute for structured columns.

## 8. Audit Fields

Every table carries `created_at`/`updated_at`. Sensitive write operations (status changes on applications/donations, admin content publishing) are additionally recorded in a dedicated audit log table (see `07_SECURITY.md`, section on Audit Logging) capturing `actor_user_id`, `action`, `entity_type`, `entity_id`, `timestamp`, and a diff/summary.

## 9. Migration Strategy

- Django migrations are the single source of schema truth; no manual schema edits via the Supabase dashboard.
- Migrations are peer-reviewed, applied via CI/CD in a controlled order (`python manage.py migrate`) against a staging environment before production.
- Destructive migrations (column drops/renames) follow an expand-and-contract pattern: add new column → backfill → switch reads/writes → remove old column in a later release.
- All migrations are version-controlled alongside the corresponding model changes in the same PR.
