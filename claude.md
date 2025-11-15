# Claude Code Session Guide

**Last Updated:** 2025-11-14 (Phase 2 Complete)
**Project:** VostraInvoice - AI-powered invoice processing for Swedish municipalities

---

## Current Status

### ✅ Completed (as of 2025-11-14)

1. **Frontend Demo Application** (React + TypeScript + Tailwind)
   - Full TypeScript conversion completed
   - Invoice list page with grid view
   - Invoice detail page with line items
   - AI suggestion system with multiple account options
   - XAI (Explainable AI) features:
     - Sannolikhet column with colored progress bars
     - Collapsible explanation box (matched words, history, uncertainty, basis)
     - Dynamic updates when account selection changes
   - Traditional dropdown with confidence percentages
   - Upload page (currently mock)
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
   - **Directory structure**: `backend/ai-extractor/` with FastAPI app
   - **OpenAI GPT-5 Vision**: Integration for invoice extraction
   - **File loader**: Base64 encoding for Vision API
   - **Extraction prompt**: Swedish invoice JSON schema
   - **Endpoints**: `/`, `/health`, `/extract`
   - **Configuration**: OPENAI_API_KEY, model=gpt-5
   - **Storage**: Same path as vostra-api for file access
   - **Testing guide**: `cc/phase-2-manual-testing.md` (PowerShell + venv)

### 🚧 Next Phase

**Phase 3: Service Integration** - See plan: `cc/invoice-upload-implementation-plan.md`

Connect the two services:
1. **vostra-api** (FastAPI): ✅ Complete
2. **vostra-ai-extractor** (FastAPI): ✅ Complete
3. **Integration**: 🚧 Next - Upload endpoint calls AI extractor

---

## Architecture Overview

### Current (Frontend + Backend Services Ready)
```
React Frontend (TypeScript)
├── Mock Invoice Data
├── Demo Pages (List, Detail, Upload)
└── XAI Features (Explainability)

vostra-api (FastAPI) ✅
├── Database: PostgreSQL (vostra-invoice-web)
├── Models: Invoice ORM with JSONB
├── File Storage: Upload/save utilities
└── Validators: File type/size checks

vostra-ai-extractor (FastAPI) ✅
├── OpenAI GPT-5 Vision integration
├── Base64 file loader
├── /extract endpoint
└── Ground-truth JSON schema prompt
```

### Next: Integration (Phase 3)
```
React Frontend
    ↓
vostra-api (FastAPI) ✅
    ├── PostgreSQL Database ✅
    ├── File Storage ✅
    ├── TODO: POST /api/invoices/upload (calls AI extractor)
    ├── TODO: POST /api/invoices/{id}/approve
    └── → vostra-ai-extractor (FastAPI) ✅
              └── OpenAI GPT-5 Vision ✅
                  (later: local LLM)
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
- `backend/ai-extractor/app/services/openai_extractor.py` - GPT-5 Vision
- `backend/ai-extractor/app/utils/file_loader.py` - Base64 file loading
- `backend/ai-extractor/requirements.txt` - Dependencies

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
- **OpenAI GPT-5 Vision** API ✅ (later: local LLM)
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
- ✅ Integrated OpenAI GPT-5 Vision
- ✅ Implemented `/extract` endpoint
- ✅ Created manual testing guide

### 🚧 Phase 3: Service Integration (Next)
- Create AI client in vostra-api
- Implement POST /api/invoices/upload endpoint
- Connect upload flow to AI extractor
- Add status tracking (uploaded→extracting→extracted)

### 📋 Phase 4-6: Additional Endpoints, Frontend, Deployment
- Additional API endpoints (GET, approve)
- Update frontend to use real API
- Deploy to Kubernetes

---

## Important Context for Future Sessions

### What Works Now
✅ Frontend demo with mock data
✅ TypeScript conversion complete
✅ XAI explainability features working
✅ Deployment pipeline functional
✅ SSL/HTTPS working
✅ **Backend API foundation (vostra-api)**
✅ **AI extraction service (vostra-ai-extractor)**
✅ **PostgreSQL database with invoice schema**
✅ **OpenAI GPT-5 Vision integration**

### What Still Needs Implementation
❌ Upload endpoint (connect frontend → API → AI extractor)
❌ Service integration (vostra-api calls ai-extractor)
❌ User approval workflow endpoint
❌ GET endpoints for invoices
❌ Frontend connected to real API (still using mocks)

### Database Status Flow (Planned)
`uploaded → extracting → extracted → approved → failed`

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
npm run dev
# Visit http://localhost:5173
```

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
