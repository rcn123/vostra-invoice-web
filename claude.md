# Claude Code Session Guide

**Last Updated:** 2025-11-20 (AI2 Database Integration)
**Project:** VostraInvoice - AI-powered invoice processing for Swedish municipalities

---

## Current Status

### ✅ Completed (as of 2025-11-20)

1. **Frontend Application - Connected to Real API** ✅ (React + TypeScript + Tailwind)
   - Full TypeScript conversion completed
   - OpenAPI TypeScript type generation from backend (`npm run generate-types`)
   - Type-safe API client using generated types
   - **InvoiceListPage**: Fetches invoices from GET /api/invoices
   - **InvoiceDetailPage**: Fetches single invoice, approval workflow, delete (dev only)
   - **UploadPage**: Real file upload to POST /api/invoices/upload
   - **ErrorBoundary**: Graceful error handling with stack traces
   - **Toast Notifications**: Modern notifications (no more alert boxes!)
   - AI suggestion system with multiple account options (per-line)
   - XAI (Explainable AI) features (ready for when AI suggestions are added):
     - Sannolikhet column with colored progress bars
     - Collapsible explanation box (matched words, history, uncertainty, basis)
     - Dynamic updates when account selection changes
     - Graceful handling when AI suggestions missing
   - Traditional dropdown with confidence percentages
   - Loading states and error handling throughout
   - Demo layout with sidebar navigation and top bar

2. **Deployment Infrastructure**
   - GitHub Actions CI/CD pipeline
   - Kubernetes (k3s) on Hetzner
   - SSL with Let's Encrypt (auto-renewal)
   - Multi-service deployment (landing + invoice app)
   - **Secrets Management**: GitHub Secrets (DB_PASSWORD, OPENAI_API_KEY)
   - **Primary domain**: https://vostrainvoice.se/ (Swedish .se domain)
   - **Secondary domain**: https://vostrainvoice.com/ (for future global expansion)
   - **Legacy domain**: https://vostra.ai/vostra-invoice/ (kept for transition period)

3. **Mock Data System** (deprecated - now using real ai2 data)
   - 3 realistic Swedish invoices in `frontend/src/data/mockInvoices.ts`
   - Follows ground-truth-schema.json structure
   - AI suggestions with confidence scores and XAI data
   - Line items with BAS accounting codes

3b. **AI2 Database Integration** ✅ **NEW as of 2025-11-20**
   - PostgreSQL database with historical transaction data
   - **Production**: Deployed on Kubernetes (postgres-ai2 service)
   - **Local dev**: postgres-ai2 container with production data imported
   - **Data import**: `backend/data/ai2_export_postgresql.sql` auto-loads on first start
   - **Schema**: `backend/ai1-db-schema.sql` (structure reference only)
   - **Key tables**:
     - `transactions`: fakturanr, belopp, ver_datum, f (supplier#), f_t (supplier name), konto, kst, projekt
     - `suppliers`: lev_nr, namn, org_nr
     - `konto_definitions`: Account definitions
   - **Invoice list migration**: GET /api/invoices now queries ai2.transactions with GROUP BY fakturanr
   - **Dual database setup**: Main app DB (local) + AI2 DB (local with real data)
   - **Benefits**: Realistic dev data, works offline, no remote connections needed

4. **Backend Phase 1: vostra-api** ✅
   - **Directory structure**: `backend/api/` with organized modules
   - **FastAPI application**: Basic app with CORS, health endpoint
   - **Database**: PostgreSQL 15 with SQLAlchemy ORM
   - **Invoice model**: Full schema with JSONB fields for AI data
   - **Pydantic schemas**: Request/response validation
   - **Alembic migrations**: Database versioning, timestamptz for UTC
   - **File storage service**: Upload, save, delete utilities
   - **File validators**: Type, size, sanitization
   - **Configuration**: Environment-based settings
   - **Docker Compose**: Local PostgreSQL for development
   - **Database name**: `vostra-invoice-web` (consistent across dev/prod)
   - **Storage path**: `/storage/vostra-invoice-web/uploads` (namespaced)

5. **Backend Phase 2: vostra-ai-extractor** ✅
   - **Directory structure**: `backend/ai-extractor/` with modular FastAPI app
   - **Modular extractors**: Separate GPT-4o and GPT-5 implementations
   - **PDF support**: PyMuPDF converts PDF→PNG for Vision API
   - **Model routing**: Auto-selects extractor based on OPENAI_MODEL config
   - **Comprehensive prompt**: Swedish invoice extraction with all fields
   - **Endpoints**: `/`, `/health`, `/extract`
   - **Configuration**: OPENAI_API_KEY, model=gpt-4o or gpt-5
   - **Storage**: Same path as vostra-api for file access
   - **Testing**: Verified with real PDF invoices ✅

6. **Backend Phase 3: Service Integration & Production Deployment** ✅
   - **Upload endpoint**: POST /api/invoices/upload (fully functional)
   - **AI client**: HTTP integration between vostra-api ↔ vostra-ai-extractor
   - **End-to-end flow**: Upload → Storage → DB → AI Extraction → Response
   - **Production deployment**:
     - Template-based secret management (declarative, GitOps-aligned)
     - Base64 encoding to handle special characters in secrets
     - Fail-fast error checking in deployment workflow
     - Kubernetes namespace: `vostra-invoice-web`
     - RWO storage (k3s local-path limitation)
     - Single replicas for API and AI extractor
   - **Live API**: https://vostra.ai/api/health ✅
   - **Tested**: Real invoice extraction working in production ✅

7. **Backend Phase 4: Additional API Endpoints** ✅
   - **GET /api/invoices/{id}**: Retrieve single invoice by ID (404 if not found)
   - **GET /api/invoices**: List invoices with pagination (skip/limit) and status filtering
   - **POST /api/invoices/{id}/approve**: User approval workflow with validation
     - Only allows approving invoices with status='extracted'
     - Explicit error for extraction_failed invoices
     - Saves user corrections to user_validated_data (JSONB)
     - Sets approved_at timestamp and status='approved'
   - **Enhanced GET /api/health**: Real DB and AI extractor connectivity checks
     - Database: Executes SELECT 1 to verify connection
     - AI Extractor: HTTP health check with 5s timeout
     - Returns: healthy/degraded/unhealthy based on component status
   - **Status flow**: `uploaded → extracting → extracted → approved` (or `extraction_failed`)
   - **Tested**: All endpoints working locally with docker-compose ✅

7. **Phase 5: Frontend Integration & UX Improvements** ✅ **DEPLOYED & WORKING IN PRODUCTION**
   - **OpenAPI Type Generation**: `npm run generate-types` from backend spec
   - **Type-Safe API Client**: `frontend/src/services/api.ts` using generated types
   - **Graceful Error Handling**: Non-JSON responses (from ingress/proxy) handled properly
   - **Production API URL**: Uses relative paths in production, localhost in dev
   - **InvoiceListPage**: Real data from GET /api/invoices with loading/error states
   - **InvoiceDetailPage**: Real data, approve workflow, delete button (dev only)
   - **UploadPage**: Real file upload with client-side validation (type, size)
   - **ErrorBoundary**: Catches React errors, shows helpful error page with stack trace
   - **Toast Notifications**: Modern slide-in notifications (rem-based positioning)
   - **DELETE /api/invoices/{id}** (DEV ONLY): Cleanup test data, deletes file + DB record
   - **Status display**: Shows uploaded/extracting/extracted/approved/extraction_failed
   - **Per-line account coding**: Swedish municipal standard preserved
   - **Production Fixes Applied**:
     - Database password changed to alphanumeric (no special chars requiring URL encoding)
     - API error responses gracefully handle non-JSON (ingress errors)
     - Frontend uses relative API paths in production
   - **Complete flow tested**: Upload → Extract → View → Approve → Delete ✅
   - **Live in production**: https://vostra.ai/vostra-invoice/ ✅

### 🚧 Next Phase

**Phase 6: Production Hardening & Optimization**

Now that the complete system is working end-to-end in production, focus on:
1. **Security**: Restrict DELETE endpoint (currently dev-only but not enforced)
2. **Monitoring**: Add logging, metrics, alerting for production health
3. **Performance**: Optimize AI extraction times, add caching where appropriate
4. **Rate Limiting**: Protect API endpoints from abuse
5. **Error Tracking**: Centralized error logging (Sentry or similar)
6. **Testing**: Automated integration tests for critical workflows
7. **Documentation**: API documentation for external consumers

---

## Architecture Overview

### Current (Full End-to-End Production System)
```
Production: https://vostrainvoice.se/ ✅ LIVE (Primary)
           https://vostrainvoice.com/ ✅ LIVE (Secondary)
           https://vostra.ai/vostra-invoice/ ✅ LIVE (Legacy)

React Frontend (TypeScript) ✅ DEPLOYED & CONNECTED
├── OpenAPI-generated types from backend
├── Type-safe API client with graceful error handling
├── InvoiceListPage → GET /api/invoices (pagination + filtering)
├── InvoiceDetailPage → GET /api/invoices/{id}, POST approve, DELETE
├── UploadPage → POST /api/invoices/upload (real file upload)
├── Toast notifications (modern UX, no alert boxes)
├── ErrorBoundary (graceful React error handling)
└── XAI Features (Explainability UI ready for future enhancements)
    ↓ (HTTPS via Traefik Ingress)

Backend API: https://vostra.ai/api ✅ DEPLOYED & OPERATIONAL
│
vostra-api (FastAPI) ✅
    ├── PostgreSQL Database (vostra-invoice-web) ✅
    ├── File Storage (/storage/vostra-invoice-web/uploads) ✅
    ├── POST /api/invoices/upload ✅ (validates, stores, extracts)
    ├── GET /api/invoices ✅ (pagination, status filtering)
    ├── GET /api/invoices/{id} ✅ (single invoice retrieval)
    ├── POST /api/invoices/{id}/approve ✅ (user validation workflow)
    ├── DELETE /api/invoices/{id} ✅ (dev cleanup, marked unsafe)
    ├── GET /api/health ✅ (DB + AI connectivity checks)
    └── → vostra-ai-extractor (FastAPI) ✅ DEPLOYED
              ├── GPT-4o Vision API (OpenAI) ✅
              ├── PDF→PNG conversion (PyMuPDF) ✅
              └── Swedish invoice extraction ✅

Kubernetes (k3s on Hetzner Cloud) ✅
├── Namespace: vostra-invoice-web
├── Pods: postgres, vostra-api, vostra-ai-extractor, vostra-invoice (all Running)
├── Secrets: DB_PASSWORD, OPENAI_API_KEY (alphanumeric for safety)
├── Storage: RWO PersistentVolumeClaims (local-path provisioner)
├── Ingress: Traefik with Let's Encrypt SSL (auto-renewal)
└── Services: ClusterIP for internal communication

Complete Workflow (End-to-End):
User uploads PDF → Frontend validates → API stores file → DB creates record →
AI extractor processes → Updates DB with extracted data → User reviews →
User approves with corrections → Final data saved → Ready for export
```

---

## Key Files & Locations

### Planning & Documentation
- `cc/invoice-upload-implementation-plan.md` - **Complete backend implementation roadmap**
- `cc/phase-2-manual-testing.md` - **Phase 2 testing guide** (PowerShell + venv)
- `cc/testing-strategy.md` - **MVP testing approach**
- `cc/todo-production.md` - **Future improvements** (Vault, monitoring, etc.)
- `cc/ground-truth-schema.json` - Invoice data schema (Swedish format)
- `cc/overall-system-description.md` - System overview
- `cc/core-rules.md` - Development principles (fail fast, no overengineering, Swedish text)
- `claude.md` - This file (session guide)
- `README.md` - User-facing documentation

### Frontend (React + TypeScript)
- `frontend/src/services/api.ts` - Type-safe API client (uses generated types)
- `frontend/src/types/api.ts` - Auto-generated OpenAPI types (run `npm run generate-types`)
- `frontend/src/pages/InvoiceDetailPage.tsx` - Detail view with approval & XAI features
- `frontend/src/pages/InvoiceListPage.tsx` - Invoice list (real data from API)
- `frontend/src/pages/UploadPage.tsx` - Real file upload with validation
- `frontend/src/components/Toast.tsx` - Modern toast notifications
- `frontend/src/components/ErrorBoundary.tsx` - Graceful error handling
- `frontend/src/components/AccountDropdown.tsx` - Account selection dropdown
- `frontend/src/components/DemoLayout.tsx` - Application layout
- `frontend/src/data/mockInvoices.ts` - Mock data (deprecated, kept for reference)

### Backend (Phases 1 & 2 Complete)

**vostra-api (Phase 1):**
- `backend/api/app/main.py` - FastAPI application
- `backend/api/app/config.py` - Configuration management
- `backend/api/app/database.py` - SQLAlchemy connection
- `backend/api/app/models/invoice.py` - Invoice ORM model (timestamptz)
- `backend/api/app/models/transaction.py` - Transaction ORM model (ai2 database) ✅ **NEW**
- `backend/api/app/schemas/invoice.py` - Pydantic schemas
- `backend/api/app/services/file_service.py` - File upload/storage
- `backend/api/app/utils/validators.py` - File validation
- `backend/api/alembic/` - Database migrations

**vostra-ai-extractor (Phase 2):**
- `backend/ai-extractor/app/main.py` - FastAPI application
- `backend/ai-extractor/app/config.py` - OpenAI configuration
- `backend/ai-extractor/app/services/openai_extractor.py` - Model router
- `backend/ai-extractor/app/services/gpt4_extractor.py` - GPT-4o implementation
- `backend/ai-extractor/app/services/gpt5_extractor.py` - GPT-5 implementation
- `backend/ai-extractor/app/utils/file_loader.py` - Base64 file loading
- `backend/ai-extractor/app/utils/pdf_converter.py` - PDF→PNG converter
- `backend/ai-extractor/requirements.txt` - Dependencies (incl. PyMuPDF)

### Docker & Deployment
- `docker-compose.yml` - **Root compose file** (full stack orchestration) ✅
- `backend/data/ai2_export_postgresql.sql` - Production AI2 data export ✅ **NEW**
- `backend/ai1-db-schema.sql` - AI2 schema reference (structure only)
- `k8s/` - All Kubernetes manifests (production)
- `.github/workflows/deploy.yml` - CI/CD pipeline

---

## Tech Stack

### Current (Frontend)
- **React 19.2.0** + TypeScript
- **Tailwind CSS 3.4.18** for styling
- **React Router 7.9.5** for navigation
- **Vite 7.2.2** for build
- **Mock data** following ground-truth schema

### Backend (Implemented)
- **FastAPI** (Python 3.11) ✅
- **PostgreSQL 15** with dual database setup ✅
  - `vostra-invoice-web` - Main app database (upload workflow)
  - `ai2` - Historical transaction data with production data imported ✅ **NEW**
  - Separate SQLAlchemy engines and sessions
  - Both databases run locally in Docker containers
  - AI2 auto-imports from `backend/data/ai2_export_postgresql.sql` on first start
- **SQLAlchemy** + Alembic migrations (timestamptz) ✅
- **OpenAI Vision API** (GPT-4o / GPT-5) ✅
- **PyMuPDF** for PDF→PNG conversion ✅
- **Modular extractors** for easy model swapping ✅
- **Docker Compose** orchestrates all services (single root docker-compose.yml) ✅
- **Kubernetes** deployment (production) ✅

---

## Development Principles (from core-rules.md)

1. **Fail fast** - No silent failures
2. **No fallbacks** - Unless explicitly asked
3. **Modular & testable** - Small functions/components
4. **No bonus features** - Build exactly what's requested
5. **No overengineering** - Keep it simple
6. **Swedish for customer-facing text** - All UI text in Swedish

---

## Current Demo Features

### Invoice List Page ✅ **CONNECTED TO AI2 DATABASE**
- Real data from ai2 transactions table (GROUP BY fakturanr)
- Displays aggregated invoice totals
- Supplier names, amounts, dates from production data
- Pagination support
- Links to detail pages

### Invoice Detail Page
- Full invoice header (supplier, buyer, dates, total)
- Line items table with:
  - Description, amount, VAT
  - AI account suggestions dropdown with confidence %
  - **Sannolikhet column** with colored progress bar + (i) icon
  - **XAI explanation box** (click i icon):
    - Matchade ord
    - Liknande historik
    - Osäkerhet
    - Underlag
  - Status badges (Granskas/Godkänd)
  - Approve buttons
- Dynamic updates when account changes
- AI-prestanda panel (82% accuracy, 14 feedback events)

### Upload Page
- Drag-and-drop file upload UI
- File validation (PDF, PNG, XML)
- Real backend integration with AI extraction

---

## Next Implementation Steps

See **`cc/invoice-upload-implementation-plan.md`** for complete roadmap.

### ✅ Phase 1: Backend Foundation (Complete)
- ✅ Created `backend/api/` structure
- ✅ Set up FastAPI with PostgreSQL
- ✅ Created database schema with timestamptz
- ✅ File storage service and validators

### ✅ Phase 2: AI Extractor (Complete)
- ✅ Created `backend/ai-extractor/` structure
- ✅ Integrated OpenAI Vision (GPT-4o + GPT-5)
- ✅ Implemented `/extract` endpoint
- ✅ Added PDF→PNG conversion (PyMuPDF)
- ✅ Created modular extractor architecture
- ✅ Tested with real PDF invoices

### ✅ Phase 3: Service Integration (Complete)
- ✅ Created AI client in vostra-api
- ✅ Implemented POST /api/invoices/upload endpoint
- ✅ Production deployment with template-based secrets
- ✅ End-to-end tested in production

### ✅ Phase 4: Additional API Endpoints (Complete)
- ✅ GET /api/invoices - List with pagination and status filtering
- ✅ **AI2 Integration**: GET /api/invoices now queries ai2.transactions (GROUP BY fakturanr)
- ✅ GET /api/invoices/{id} - Single invoice retrieval
- ✅ POST /api/invoices/{id}/approve - User approval workflow
- ✅ Enhanced GET /api/health - DB and AI extractor connectivity
- ✅ Status tracking: uploaded→extracting→extracted→approved (or extraction_failed)
- ✅ Tested locally with docker-compose

### ✅ Phase 5: Frontend Integration (Complete)
- ✅ OpenAPI TypeScript type generation
- ✅ Type-safe API client implementation
- ✅ InvoiceListPage connected to real API
- ✅ InvoiceDetailPage with approve workflow
- ✅ UploadPage with real file upload
- ✅ Loading states and error handling

### 📋 Phase 6: Testing & Production Deployment (Next)
- Local end-to-end testing
- Deploy backend to Kubernetes
- Deploy frontend to production
- Production testing

---

## Important Context for Future Sessions

### What Works Now
✅ **Frontend connected to real API** (no more mocks!)
✅ **OpenAPI TypeScript type generation** (type safety)
✅ **Type-safe API client** (InvoiceListPage, InvoiceDetailPage, UploadPage)
✅ **Complete upload → extraction → approval flow** (locally tested)
✅ TypeScript conversion complete
✅ XAI explainability features working
✅ Deployment pipeline functional
✅ SSL/HTTPS working
✅ **Backend API foundation (vostra-api)**
✅ **AI extraction service (vostra-ai-extractor)**
✅ **PostgreSQL database with invoice schema**
✅ **OpenAI Vision integration (GPT-4o + GPT-5)**
✅ **PDF extraction via PyMuPDF conversion**
✅ **Modular extractor architecture for model swapping**
✅ **Complete CRUD API** (upload, get, list, approve)
✅ **Enhanced health checks** (DB + AI connectivity)
✅ **Status flow validation** (extraction_failed handling)
✅ **AI2 Database Integration** (local with production data import) ✅ **NEW as of 2025-11-20**
✅ **Invoice list from ai2.transactions** (GROUP BY fakturanr with aggregated totals)

### What Still Needs Implementation (Phase 6 - Production Hardening)
❌ DELETE endpoint access control (currently dev-only in comments, not enforced)
❌ Rate limiting and API abuse protection
❌ Centralized error logging and monitoring (Sentry, CloudWatch, etc.)
❌ Performance optimization (caching strategies, query optimization)
❌ Automated integration tests for critical workflows
❌ API documentation for external consumers (Swagger UI enhancement)

### Database Status Flow (Implemented)
`uploaded → extracting → extracted → approved` (or `extraction_failed`)

### Two-Service Architecture (Why?)
- **Easy LLM swap**: Replace GPT-4 with local model later
- **Separation of concerns**: API handles DB/files, AI handles extraction
- **Scalability**: Scale AI extraction independently
- **Clean contract**: Internal API between services

---

## Deployment

### Live URLs
- **Invoice App (Primary)**: https://vostrainvoice.se/
- **Invoice App (Secondary)**: https://vostrainvoice.com/
- **Invoice App (Legacy)**: https://vostra.ai/vostra-invoice/
- **Landing Page (Legacy)**: https://vostra.ai/

### Deploy Process
1. Push to GitHub: `git push origin main`
2. GitHub Actions automatically:
   - Builds Docker images
   - SSHs to Hetzner server
   - Deploys to k3s
   - Restarts pods

### View Status
```bash
kubectl get pods -n vostra-invoice
kubectl logs -f deployment/vostra-invoice -n vostra-invoice
```

---

## Session Continuity

When resuming work across sessions:

1. **Read this file** to understand current status
2. **Check `cc/invoice-upload-implementation-plan.md`** for next steps
3. **Review recent git commits** to see latest changes
4. **Test the live demo** at https://vostra.ai/vostra-invoice/
5. **Check todo list** in plan document for progress

---

## Common Tasks

### Start Everything (One Command) ✅ **RECOMMENDED**

**Prerequisites:**
1. Ensure `.env` file exists in root with:
```bash
OPENAI_API_KEY=sk-your-key-here
```

2. Start all services:
```bash
docker compose up
```

This starts the entire stack from root directory:
- **postgres** (vostra-invoice-web) on port 5432 - Main app database
- **postgres-ai2** (ai2) on port 5433 - Historical data (auto-imports production data on first start)
- **ai-extractor** on port 8001 - AI extraction service
- **api** on port 8000 - Backend API
- **frontend** on port 5173 - React frontend

Visit:
- **Frontend**: http://localhost:5173
- **API docs**: http://localhost:8000/docs

**Note:** AI2 database automatically imports production data from `backend/data/ai2_export_postgresql.sql` on first container start. This only happens once; subsequent starts use the persisted volume data.

### Test Frontend Locally
```bash
cd frontend
npm install

# Generate TypeScript types from backend (requires backend running)
npm run generate-types

npm run dev
# Visit http://localhost:5173
```

### Generate TypeScript Types from Backend
```bash
# Start backend first
docker compose up

# In another terminal, generate types
cd frontend
npm run generate-types
# Creates src/types/api.ts from http://localhost:8000/openapi.json
```

**Note:** Run `npm run generate-types` manually whenever backend schemas change.

### Build Frontend
```bash
cd frontend
npm run build
# Check dist/ folder
```

### Deploy to Production
```bash
git add .
git commit -m "description"
git push origin main
# GitHub Actions handles deployment
```

---

## Key Design Decisions

### Why TypeScript?
- Type safety for complex invoice data structures
- Better IDE support
- Easier refactoring

### Why Two Backend Services?
- **vostra-api**: Stable, handles DB and files
- **vostra-ai-extractor**: Swappable (GPT-5 → local LLM later)
- Clean separation, easy to maintain
- Can scale AI service independently

### Why JSONB in PostgreSQL?
- Flexible schema for varying invoice formats
- Easy to evolve over time
- Can add normalized tables later if needed

### Why Dual Database Setup?
- **vostra-invoice-web**: New upload workflow, AI extraction, user approvals
- **ai2**: Historical data showcase, production transactions for demos
- Separate concerns, each database optimized for its purpose
- Local dev uses production data dump for realistic testing

---

## Troubleshooting

### Frontend Build Errors
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Ensure no `.jsx` files remain (all should be `.tsx`)

### Deployment Issues
- Check GitHub Actions logs
- SSH to server: `ssh root@65.21.145.222`
- View pod logs: `kubectl logs -f deployment/vostra-invoice -n vostra-invoice`

### SSL Certificate Issues
- Check status: `kubectl get certificate -n vostra-invoice`
- Describe: `kubectl describe certificate vostra-tls -n vostra-invoice`

---

## Resources

- **Ground Truth Schema**: `cc/ground-truth-schema.json`
- **Implementation Plan**: `cc/invoice-upload-implementation-plan.md`
- **Core Rules**: `cc/core-rules.md`
- **Live Demo**: https://vostrainvoice.se/
- **GitHub Repo**: https://github.com/rcn123/vostra-invoice-web

---

## Notes for Claude Code

- All user-facing text must be in Swedish
- Follow core-rules.md principles strictly
- Use TodoWrite tool to track progress across sessions
- Test builds before committing
- Keep implementation plan updated with progress
- Ask questions rather than assume requirements
