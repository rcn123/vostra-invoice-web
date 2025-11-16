# Claude Code Session Guide

**Last Updated:** 2025-11-16 (Phase 5 Complete - Frontend Connected to Real API)
**Project:** VostraInvoice - AI-powered invoice processing for Swedish municipalities

---

## Current Status

### ✅ Completed (as of 2025-11-16)

1. **Frontend Application - Connected to Real API** ✅ (React + TypeScript + Tailwind)
   - Full TypeScript conversion completed
   - OpenAPI TypeScript type generation from backend
   - Type-safe API client using generated types
   - **InvoiceListPage**: Fetches invoices from GET /api/invoices
   - **InvoiceDetailPage**: Fetches single invoice, approval workflow
   - **UploadPage**: Real file upload to POST /api/invoices/upload
   - AI suggestion system with multiple account options (per-line)
   - XAI (Explainable AI) features:
     - Sannolikhet column with colored progress bars
     - Collapsible explanation box (matched words, history, uncertainty, basis)
     - Dynamic updates when account selection changes
   - Traditional dropdown with confidence percentages
   - Loading states and error handling throughout
   - Demo layout with sidebar navigation and top bar

2. **Deployment Infrastructure**
   - GitHub Actions CI/CD pipeline
   - Kubernetes (k3s) on Hetzner
   - SSL with Let's Encrypt (auto-renewal)
   - Multi-service deployment (landing + invoice app)
   - **Secrets Management**: GitHub Secrets (DB_PASSWORD, OPENAI_API_KEY)
   - Live at: https://vostra.ai/vostra-invoice/

3. **Mock Data System**
   - 3 realistic Swedish invoices in `frontend/src/data/mockInvoices.ts`
   - Follows ground-truth-schema.json structure
   - AI suggestions with confidence scores and XAI data
   - Line items with BAS accounting codes

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

7. **Backend Phase 5: Frontend Integration** ✅
   - **OpenAPI Type Generation**: `npm run generate-types` from backend spec
   - **Type-Safe API Client**: `frontend/src/services/api.ts` using generated types
   - **InvoiceListPage**: Real data from GET /api/invoices with loading/error states
   - **InvoiceDetailPage**: Real data from GET /api/invoices/{id}, approve workflow
   - **UploadPage**: Real file upload to POST /api/invoices/upload with validation
   - **Status display**: Shows uploaded/extracting/extracted/approved/extraction_failed
   - **Per-line account coding**: Swedish municipal standard preserved
   - **Ready for testing**: All pages connected to backend API

### 🚧 Next Phase

**Phase 6: Local Testing & Production Deployment**

Testing and deployment tasks:
1. Test complete upload → extraction → approval flow locally
2. Verify all API endpoints work correctly with frontend
3. Test error handling (extraction_failed, network errors)
4. Deploy Phase 4 backend to Kubernetes production
5. Deploy Phase 5 frontend to production
6. End-to-end testing in production environment

---

## Architecture Overview

### Current (Frontend Connected to Backend)
```
React Frontend (TypeScript) ✅ CONNECTED
├── OpenAPI-generated types
├── Type-safe API client
├── InvoiceListPage → GET /api/invoices
├── InvoiceDetailPage → GET /api/invoices/{id}, POST approve
├── UploadPage → POST /api/invoices/upload
└── XAI Features (Explainability)

Backend API (Local: http://localhost:8000) ✅
│
vostra-api (FastAPI) - Deployed ✅
    ├── PostgreSQL Database (vostra-invoice-web) ✅
    ├── File Storage (/storage/vostra-invoice-web/uploads) ✅
    ├── POST /api/invoices/upload ✅ WORKING
    ├── GET /api/invoices ✅ WORKING (pagination + filtering)
    ├── GET /api/invoices/{id} ✅ WORKING
    ├── POST /api/invoices/{id}/approve ✅ WORKING
    ├── GET /api/health ✅ WORKING (enhanced with DB + AI checks)
    └── → vostra-ai-extractor (FastAPI) ✅ WORKING
              ├── GPT-4o Vision (production) ✅
              ├── PDF→PNG conversion ✅
              └── Swedish invoice extraction ✅

Kubernetes (k3s on Hetzner) ✅
├── Namespace: vostra-invoice-web
├── Pods: postgres, vostra-api, vostra-ai-extractor (all Running)
├── Secrets: Template-based management with base64 encoding
├── Storage: RWO PersistentVolumeClaims
└── Ingress: Traefik with Let's Encrypt SSL
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
- `frontend/src/pages/InvoiceDetailPage.tsx` - Detail view with XAI features
- `frontend/src/pages/InvoiceListPage.tsx` - Grid view of invoices
- `frontend/src/pages/UploadPage.tsx` - File upload (currently mock)
- `frontend/src/components/AccountDropdown.tsx` - Account selection dropdown
- `frontend/src/components/DemoLayout.tsx` - Application layout
- `frontend/src/data/mockInvoices.ts` - Mock invoice data

### Backend (Phases 1 & 2 Complete)

**vostra-api (Phase 1):**
- `backend/api/app/main.py` - FastAPI application
- `backend/api/app/config.py` - Configuration management
- `backend/api/app/database.py` - SQLAlchemy connection
- `backend/api/app/models/invoice.py` - Invoice ORM model (timestamptz)
- `backend/api/app/schemas/invoice.py` - Pydantic schemas
- `backend/api/app/services/file_service.py` - File upload/storage
- `backend/api/app/utils/validators.py` - File validation
- `backend/api/alembic/` - Database migrations
- `backend/docker-compose.dev.yml` - Local PostgreSQL

**vostra-ai-extractor (Phase 2):**
- `backend/ai-extractor/app/main.py` - FastAPI application
- `backend/ai-extractor/app/config.py` - OpenAI configuration
- `backend/ai-extractor/app/services/openai_extractor.py` - Model router
- `backend/ai-extractor/app/services/gpt4_extractor.py` - GPT-4o implementation
- `backend/ai-extractor/app/services/gpt5_extractor.py` - GPT-5 implementation
- `backend/ai-extractor/app/utils/file_loader.py` - Base64 file loading
- `backend/ai-extractor/app/utils/pdf_converter.py` - PDF→PNG converter
- `backend/ai-extractor/requirements.txt` - Dependencies (incl. PyMuPDF)

### Kubernetes & Deployment
- `k8s/` - All Kubernetes manifests
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
- **PostgreSQL 15** with JSONB fields ✅
- **SQLAlchemy** + Alembic migrations (timestamptz) ✅
- **OpenAI Vision API** (GPT-4o / GPT-5) ✅
- **PyMuPDF** for PDF→PNG conversion ✅
- **Modular extractors** for easy model swapping ✅
- **Virtual environments** (venv) for isolation ✅
- **Kubernetes** deployment - Phase 6 (planned)

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

### Invoice List Page
- Grid view of 3 mock invoices
- Status indicators (Granskas, Godkänd)
- Supplier, amount, date columns
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
- Currently simulated (no backend yet)

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

### What Still Needs Implementation
❌ End-to-end testing of complete flow
❌ Production deployment of Phase 4 backend
❌ Production deployment of Phase 5 frontend

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
- **Landing**: https://vostra.ai/
- **Invoice App**: https://vostra.ai/vostra-invoice/

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
cd backend && docker-compose -f docker-compose.dev.yml up

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

### Why Mock Data First?
- Test UX before backend complexity
- Iterate on frontend independently
- Clear API contract before implementation

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
- **Live Demo**: https://vostra.ai/vostra-invoice/
- **GitHub Repo**: https://github.com/rcn123/vostra-invoice-web

---

## Notes for Claude Code

- All user-facing text must be in Swedish
- Follow core-rules.md principles strictly
- Use TodoWrite tool to track progress across sessions
- Test builds before committing
- Keep implementation plan updated with progress
- Ask questions rather than assume requirements
