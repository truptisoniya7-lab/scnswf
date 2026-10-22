# SCNSWF Website Rebuild

**Suresh Chandra Nayak Social Welfare Foundation** - production-grade website rebuild.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Routing | React Router |
| Backend | Node.js + Express + TypeScript |
| Database | Google Cloud Firestore (Native) |
| Auth | JWT (Access & Refresh tokens) |

## Phases

- [x] Phase 1 - Repo Scaffold
- [x] Phase 2 - UI Foundation
- [x] Phase 3 - Backend Foundation
- [x] Phase 4 - Database (Cloud Firestore configured for project-ngo-scnswf)
- [ ] Phase 5 - API Integration
- [ ] Phase 6 - Forms
- [ ] Phase 7 - Donation System
- [ ] Phase 8 - Admin / CMS
- [ ] Phase 9 - Testing
- [ ] Phase 10 - Deployment

## Backend Quickstart (TypeScript & Express)

1. **Navigate to Backend Directory**:
   ```powershell
   cd backend
   ```
2. **Install Dependencies**:
   ```powershell
   npm install
   ```
3. **Run Dev Server**:
   ```powershell
   npm run dev
   ```
4. **Build & Test**:
   ```powershell
   npm run build
   npm test
   ```
5. **Cloud Firestore Setup (`project-ngo-scnswf`)**:
   - Console URL: [Firebase Console Firestore](https://console.firebase.google.com/u/3/project/project-ngo-scnswf/firestore/databases/-default-/data)
   - Download the service account JSON key from [Firebase Service Accounts](https://console.firebase.google.com/u/3/project/project-ngo-scnswf/settings/serviceaccounts/adminsdk) and save as `backend/serviceAccountKey.json`.
   - Seed all 19 NGO collections & documents into Firestore:
     ```powershell
     npm run seed:firestore
     ```
6. **Health Check & API Docs**:
   - Health Check: `http://localhost:8000/api/v1/health/`
   - Interactive Swagger Docs: `http://localhost:8000/api/v1/schema/swagger-ui/`
   - OpenAPI Schema: `http://localhost:8000/api/v1/schema/`
