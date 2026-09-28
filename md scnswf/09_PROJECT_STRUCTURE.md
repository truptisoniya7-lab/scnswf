# Project Structure Document
## SCNSWF Website Rebuild

---

## 1. Repository Root

```
scnswf-website/
├── frontend/
├── backend/
├── docs/
├── database/
├── scripts/
├── .github/
│   └── workflows/
├── README.md
├── .gitignore
└── .env.example
```

## 2. Frontend Structure (`frontend/`)

```
frontend/
├── public/
├── src/
│   ├── components/        # Reusable, presentational UI components (Button, Card, Navbar, Footer, FormField...)
│   │   ├── ui/             # Design-system primitives
│   │   ├── layout/         # Navbar, Footer, PageLayout
│   │   └── forms/          # Shared form components/inputs
│   ├── pages/              # Route-level page components (Home, About, Programs, ProgramDetail, Impact, Donate, Volunteer, Internship, Partnerships, Contact, Gallery, Stories, Legal/*)
│   ├── layouts/             # Layout wrappers (PublicLayout, AdminLayout)
│   ├── hooks/               # Custom hooks (useDonation, useForm helpers, useMediaQuery, useAuth)
│   ├── services/            # Business-oriented service functions (donationService, applicationService, contentService)
│   ├── api/                 # Low-level API client (Axios instance, endpoint wrappers, interceptors)
│   ├── context/             # React Context providers (AuthContext, ToastContext)
│   ├── utils/                # Formatting, validation helpers, constants
│   ├── types/                # TypeScript types/interfaces (mirrors backend serializer shapes)
│   ├── assets/               # Static images, icons (non-CMS assets)
│   ├── data/                  # Static config (nav items, legal placeholder text where applicable)
│   ├── styles/                # Tailwind config extensions, global CSS
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## 3. Backend Structure (`backend/`)

```
backend/
├── config/                   # Django project settings, root URLconf, WSGI/ASGI
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── core/                  # Shared base models/mixins, AuditLog, common permissions/pagination
│   ├── accounts/               # User, AdminProfile, auth (JWT), roles/permissions
│   ├── programs/                # Program, ProgramService
│   ├── impact/                   # ImpactMetric, ImpactStory
│   ├── gallery/                   # GalleryAlbum, GalleryImage
│   ├── stories/                    # (or merged into impact) Stories of Change
│   ├── events/                      # Event
│   ├── partners/                     # Partner, TeamMember
│   ├── applications/                  # VolunteerApplication, InternshipApplication, PartnershipRequest
│   ├── contact/                        # ContactMessage, NewsletterSubscriber
│   ├── donations/                       # Donation, DonationTransaction, payment_provider service abstraction
│   └── documents/                        # Document, AnnualReport
├── tests/                                 # Cross-app integration tests
├── manage.py
├── requirements.txt
├── Procfile / gunicorn config
└── .env.example
```

Each app under `apps/` follows the same internal layering:
```
apps/<app_name>/
├── migrations/
├── models.py
├── serializers.py
├── services.py        # business logic (where non-trivial)
├── views.py            # or viewsets.py
├── permissions.py
├── filters.py
├── urls.py
├── admin.py             # Django admin registration (internal use)
├── tests/
└── apps.py
```

## 4. Components / Pages Mapping (Frontend)

| Page (`pages/`) | Key Components Used |
|---|---|
| Home | Hero, MissionStatement, ProgramsPreview, ImpactStats, GalleryPreview, StoriesPreview, PartnersStrip, CTASection |
| About | OrgIntro, MissionVisionValues, Timeline, LeadershipGrid, TeamGrid |
| Programs / ProgramDetail | ProgramCard, ProgramList, ProgramHero, ServicesList, ImpactSummary |
| Impact | StatCard (Recharts), GeoReachMap/List, ProgramImpactBreakdown, StoryCard, AnnualReportList |
| Get Involved (Volunteer/Donate/Partner/Internship) | DonationForm, VolunteerForm, InternshipForm, PartnershipForm, OpportunityCard |
| Contact | ContactForm, ContactInfoCard, MapEmbed, FAQAccordion |
| Gallery | AlbumGrid, ImageLightbox |
| Stories | StoryCard, StoryDetail |
| Legal pages | LegalPageLayout (Markdown/rich-text rendered content) |

## 5. Hooks / Services / API Layer (Frontend)

- `api/client.ts` — configured Axios instance (base URL, interceptors for auth header, error normalization).
- `api/programs.ts`, `api/donations.ts`, `api/applications.ts`, etc. — thin endpoint wrappers matching `05_API_DOCUMENTATION.md`.
- `services/donationService.ts` — orchestrates donation creation + payment provider redirect/checkout.
- `services/applicationService.ts` — handles volunteer/internship/partnership submission + file upload for resumes.
- `hooks/useAuth.ts` — admin auth state, token refresh handling.
- `hooks/useForm*.ts` — shared React Hook Form + Zod wiring per form.

## 6. Models / Serializers / Views / URLs (Backend)

- **Models:** as defined in `04_DATABASE_DESIGN.md`, one model per file section within each app's `models.py` (or split into `models/` package if an app grows large, e.g., `donations/models/donation.py`, `donations/models/transaction.py`).
- **Serializers:** one serializer (or read/write pair) per model, plus nested serializers for related data (e.g., `ProgramDetailSerializer` nesting `ProgramServiceSerializer`).
- **Views:** DRF `ModelViewSet`/`GenericAPIView` subclasses per resource; public vs. admin viewsets kept separate even where they share a model, to keep permission logic unambiguous (e.g., `ProgramPublicViewSet` vs. `ProgramAdminViewSet`).
- **URLs:** each app exposes its own `urls.py`, included from `config/urls.py` under `/api/v1/<app-prefix>/`.

## 7. Permissions (Backend)

- `apps/core/permissions.py` — shared base permission classes (`IsSuperAdmin`, `IsContentEditor`, `IsApplicationsReviewer`, `ReadOnlyOrAdmin`).
- Each app's `permissions.py` (where needed) composes these base classes for resource-specific rules.

## 8. Tests

- **Frontend:** `frontend/src/**/__tests__/` or colocated `*.test.tsx` files (Vitest + React Testing Library); `frontend/e2e/` for Playwright specs.
- **Backend:** `apps/<app_name>/tests/` per app (models, serializers, views/permissions) + `backend/tests/` for cross-app integration and workflow tests (e.g., full donation flow, full application flow).

## 9. Supporting Directories

- `database/` — SQL reference exports/ERD diagrams (generated, not hand-maintained schema — Django migrations remain the source of truth).
- `scripts/` — one-off operational scripts (e.g., data seeding for local dev, backup helpers).
- `.github/workflows/` — CI/CD pipelines (lint, test, build, deploy) per `10_DEPLOYMENT.md`.
