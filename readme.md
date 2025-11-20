# VostraInvoice Web

**Last Updated:** 2025-11-20 (AI2 Database Integration)

Public marketing website and demo for VostraInvoice - AI-powered invoice processing for Swedish municipalities and organizations.

**Live at:** https://vostrainvoice.se/ (primary), https://vostrainvoice.com/ (secondary)

## Current Status

### ✅ Complete End-to-End System - LIVE IN PRODUCTION

**Full Invoice Processing Workflow**: Upload → AI Extract → Review → Approve ✅

- **Frontend Application**: React + TypeScript, fully connected to backend API
  - Real-time invoice upload with client-side validation
  - Live invoice list with pagination and filtering
  - Invoice detail view with approval workflow
  - Modern UX: Toast notifications, graceful error handling
  - Type-safe API client with OpenAPI-generated types
  - **Primary**: https://vostrainvoice.se/
  - **Secondary**: https://vostrainvoice.com/
  - **Legacy**: https://vostra.ai/vostra-invoice/ (transition period)

- **Backend API**: FastAPI + PostgreSQL ✅ Live at https://vostra.ai/api
  - POST /api/invoices/upload - Upload & AI extract invoices
  - GET /api/invoices - List with pagination & status filtering
  - GET /api/invoices/{id} - Retrieve single invoice
  - POST /api/invoices/{id}/approve - User approval workflow
  - DELETE /api/invoices/{id} - Dev cleanup (marked unsafe for prod)
  - GET /api/health - DB + AI connectivity checks

- **AI Extraction**: OpenAI GPT-4o Vision ✅ Working in production
  - Modular architecture for easy model swapping
  - PyMuPDF for PDF→PNG conversion
  - Tested with real Swedish invoices

- **Infrastructure**: Kubernetes (k3s) + Traefik + Let's Encrypt SSL ✅ Auto-deploy

### 🚧 Next Phase
- **Phase 6**: Production hardening (monitoring, rate limiting, security)

## Features

Try the live system at https://vostrainvoice.se/

### Real Invoice Processing
- **Upload Invoices**: Drag-and-drop PDF, PNG, or JPG files (max 10 MB)
- **AI Extraction**: Automatic data extraction using GPT-4o Vision
  - Supplier information (name, org number, contact)
  - Invoice details (number, dates, amounts, VAT)
  - Line items with descriptions and amounts
- **Review & Approve**: View extracted data, make corrections, approve
- **Status Tracking**: uploaded → extracting → extracted → approved → extraction_failed

### User Experience
- **Modern UI**: Toast notifications, loading states, error handling
- **Type Safety**: TypeScript throughout with OpenAPI-generated types
- **Swedish Localization**: All text in Swedish for municipal users
- **Responsive Design**: Works on desktop and mobile

### For Future Enhancement
- **XAI (Explainable AI)** UI components ready:
  - Visual confidence bars (green/yellow/gray)
  - Clickable explanations showing matched words, history, and reasoning
  - Dynamic updates when changing account selections

## Tech Stack

### Current (Production)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Infrastructure**: Kubernetes (k3s) on Hetzner with Traefik ingress
- **SSL**: Let's Encrypt via cert-manager (auto-renewal)
- **CI/CD**: GitHub Actions → Auto-deploy to k8s

### Backend (Production)
- **API Service**: FastAPI (Python 3.11) ✅ DEPLOYED & OPERATIONAL
- **AI Extraction**: Separate FastAPI service ✅ DEPLOYED & WORKING
  - Modular architecture (GPT-4o / GPT-5)
  - PDF→PNG conversion via PyMuPDF
  - Comprehensive Swedish extraction prompt
- **Database**: PostgreSQL 15 with JSONB ✅ Running in Kubernetes
- **File Storage**: RWO PersistentVolumeClaim (k3s local-path)
- **Secrets**: GitHub Secrets with alphanumeric passwords (no special chars)
- **Status Flow**: uploaded → extracting → extracted → approved (or extraction_failed)
- **Complete Integration**: Frontend ↔ API ↔ AI ↔ Database ✅ Phase 5 complete
- **Future**: Local LLM (easy swap via modular design)

## Project Structure

```
vostra-invoice-web/
├── frontend/                      # React + TypeScript application ✅ LIVE & CONNECTED
│   ├── src/
│   │   ├── services/             # API client (type-safe, OpenAPI-generated)
│   │   ├── types/                # TypeScript types (auto-generated from backend)
│   │   ├── components/           # Toast, ErrorBoundary, AccountDropdown, DemoLayout
│   │   ├── pages/                # InvoiceListPage, InvoiceDetailPage, UploadPage
│   │   ├── data/                 # Mock data (deprecated, kept for reference)
│   │   └── App.tsx               # Main app with routing
│   ├── package.json              # Includes "generate-types" script
│   ├── vite.config.js            # Vite config (base: '/vostra-invoice/')
│   ├── tsconfig.json             # TypeScript configuration
│   └── Dockerfile                # Multi-stage Docker build
├── backend/                       # Backend services
│   ├── api/                      # Main API service (FastAPI) ✅ Phase 1
│   │   ├── app/
│   │   │   ├── models/          # SQLAlchemy ORM models
│   │   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── services/        # File upload, business logic
│   │   │   └── utils/           # Validators, helpers
│   │   ├── alembic/             # Database migrations
│   │   └── requirements.txt
│   ├── ai-extractor/             # AI extraction service (FastAPI) ✅ Phase 2
│   │   ├── app/
│   │   │   ├── services/        # Modular extractors (GPT-4o, GPT-5)
│   │   │   └── utils/           # PDF converter, file loaders
│   │   └── requirements.txt     # Includes PyMuPDF
│   └── docker-compose.dev.yml   # Local PostgreSQL
├── landing/                       # Root landing page ✅ LIVE
│   ├── index.html
│   ├── nginx.conf
│   └── Dockerfile
├── k8s/                           # Kubernetes manifests ✅ DEPLOYED
│   ├── namespace.yaml            # vostra-invoice namespace
│   ├── cluster-issuer.yaml       # Let's Encrypt ClusterIssuer
│   ├── postgres-deployment.yaml  # PostgreSQL (planned)
│   ├── api-deployment.yaml       # Backend API (planned)
│   ├── ai-extractor-deployment.yaml  # AI service (planned)
│   ├── landing-deployment.yaml   # Landing page
│   ├── invoice-deployment.yaml   # Invoice app
│   └── ingress.yaml              # Traefik ingress with SSL
├── cc/                            # Planning and documentation
│   ├── invoice-upload-implementation-plan.md  # 📋 Backend roadmap
│   ├── phase-2-manual-testing.md  # 🧪 Phase 2 testing guide
│   ├── testing-strategy.md       # MVP testing approach
│   ├── ground-truth-schema.json  # Invoice data schema
│   ├── overall-system-description.md
│   └── core-rules.md             # Development principles
├── .github/workflows/             # GitHub Actions CI/CD ✅ WORKING
│   └── deploy.yml                # Auto-deploy on push to main
├── claude.md                      # Session guide for Claude Code
├── README.md                      # This file
└── core-rules.md                  # Fail fast, no overengineering, Swedish text
```

## Live Deployment

### Production URLs
- **Invoice App (Primary)**: https://vostrainvoice.se/
- **Invoice App (Secondary)**: https://vostrainvoice.com/
- **Invoice App (Legacy)**: https://vostra.ai/vostra-invoice/
- **Landing Page (Legacy)**: https://vostra.ai/
- **SSL**: Valid Let's Encrypt certificates (auto-renew)

### Infrastructure
- **Server**: Hetzner dedicated (65.21.145.222)
- **Cluster**: k3s (Kubernetes)
- **Ingress**: Traefik (ports 80, 443)
- **SSL**: cert-manager + Let's Encrypt
- **Namespace**: `vostra`
- **Replicas**: 2 pods each (landing + invoice)

## Local Development

### Local Development (One Command)

**✅ RECOMMENDED: Start Everything with Root Docker Compose**

```bash
docker-compose up --build
```

This starts the **entire stack** from root directory:
- **postgres** (vostra-invoice-web) on port 5432
- **postgres-ai2** (historical data with schema) on port 5433 ✅ **NEW**
- **ai-extractor** (OpenAI Vision) on port 8001
- **api** (FastAPI) on port 8000
- **frontend** (React + Vite) on port 5173 ✅ **NEW**

Visit:
- **Frontend**: http://localhost:5173
- **API docs**: http://localhost:8000/docs

**What's New (2025-11-20):**
- **Root docker-compose.yml** orchestrates all services
- **Frontend in Docker** with hot reload
- AI2 database with auto-loaded schema
- Invoice list queries ai2.transactions (GROUP BY fakturanr)

### Alternative: Run Frontend Separately

If you prefer faster hot reload:

```bash
cd frontend
npm install
npm run dev
```

**Note:** Run `npm run generate-types` manually whenever backend schemas change

### Routes

- `/` - Landing page
- `/demo` - Demo placeholder

## Deployment

### Automatic Deployment (Recommended)

**Setup GitHub Secrets** (one-time setup):

1. Go to: https://github.com/rcn123/vostra-invoice-web/settings/secrets/actions
2. Add these secrets:
   - `HETZNER_HOST`: `65.21.145.222`
   - `HETZNER_USER`: `root`
   - `HETZNER_SSH_KEY`: Your SSH private key
   - `DB_PASSWORD`: Strong PostgreSQL password for production
   - `OPENAI_API_KEY`: Your OpenAI API key (sk-...)

**Deploy:**

```bash
# From your local computer
git add .
git commit -m "your changes"
git push origin main
```

GitHub Actions will automatically:
1. Build new Docker images
2. SSH to Hetzner server
3. Pull latest code
4. Rebuild images on server
5. Import images to k3s
6. Restart deployments
7. Verify pods are running

### Manual Deployment

SSH to server and rebuild:

```bash
# SSH to server
ssh root@65.21.145.222

# Navigate to project
cd /var/www/vostra-invoice-web

# Pull latest changes
git pull origin main

# Rebuild images
docker build -t vostra-landing:v1 ./landing
docker build -t vostra-invoice-frontend:v1 ./frontend

# Import to k3s
docker save vostra-landing:v1 | sudo k3s ctr images import -
docker save vostra-invoice-frontend:v1 | sudo k3s ctr images import -

# Restart deployments
kubectl rollout restart deployment/vostra-landing -n vostra
kubectl rollout restart deployment/vostra-invoice -n vostra

# Verify
kubectl get pods -n vostra
```

## Kubernetes Management

### View Status

```bash
# Check all pods
kubectl get pods -n vostra

# Check ingress
kubectl get ingress -n vostra

# Check SSL certificate
kubectl get certificate -n vostra
kubectl describe certificate vostra-tls -n vostra

# Check services
kubectl get svc -n vostra
```

### View Logs

```bash
# Landing page logs
kubectl logs -n vostra -l app=vostra-landing

# Invoice app logs
kubectl logs -n vostra -l app=vostra-invoice

# Follow logs
kubectl logs -n vostra -l app=vostra-invoice -f
```

### Scale Deployments

```bash
# Scale to 3 replicas
kubectl scale deployment/vostra-invoice --replicas=3 -n vostra

# Scale down to 1 replica
kubectl scale deployment/vostra-landing --replicas=1 -n vostra
```

### Restart Deployments

```bash
# Restart invoice app
kubectl rollout restart deployment/vostra-invoice -n vostra

# Restart landing page
kubectl rollout restart deployment/vostra-landing -n vostra
```

## SSL Certificate Management

SSL certificates are automatically managed by cert-manager:

- **Issuer**: Let's Encrypt (production)
- **Renewal**: Automatic (30 days before expiry)
- **Contact**: support@vostra.ai
- **Domains**: vostra.ai

### Check Certificate Status

```bash
# View certificate
kubectl get certificate -n vostra

# Detailed info
kubectl describe certificate vostra-tls -n vostra

# Check Let's Encrypt challenges (only during initial issuance)
kubectl get challenges -n vostra
```

### Force Certificate Renewal

```bash
# Delete certificate (it will be recreated)
kubectl delete certificate vostra-tls -n vostra

# Wait for new certificate
kubectl get certificate -n vostra -w
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n vostra

# Describe pod for events
kubectl describe pod <pod-name> -n vostra

# Check logs
kubectl logs <pod-name> -n vostra
```

### SSL Certificate Issues

```bash
# Check certificate status
kubectl describe certificate vostra-tls -n vostra

# Check challenges
kubectl get challenges -n vostra

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager
```

### Image Pull Errors

If pods show `ErrImagePull`:

```bash
# Rebuild and import images
cd /var/www/vostra-invoice-web
docker build -t vostra-invoice-frontend:v1 ./frontend
docker save vostra-invoice-frontend:v1 | sudo k3s ctr images import -
kubectl rollout restart deployment/vostra-invoice -n vostra
```

### DNS Issues

```bash
# Check DNS propagation
nslookup vostrainvoice.se 8.8.8.8
nslookup www.vostrainvoice.se 8.8.8.8
nslookup vostrainvoice.com 8.8.8.8

# Test from server
curl -I https://vostrainvoice.se/
curl -I https://vostrainvoice.com/
```

## Architecture

### Path-Based Routing

```
Primary domains (vostrainvoice.se, vostrainvoice.com):
├── /                    → vostra-invoice (React app at root)
└── /api/                → vostra-api (backend API)

Legacy domain (vostra.ai):
├── /                    → vostra-landing (root landing page)
├── /vostra-invoice/     → vostra-invoice (React app at subpath)
└── /api/                → vostra-api (backend API)
```

### Request Flow

```
User Request (vostrainvoice.se or vostrainvoice.com)
    ↓
DNS → 65.21.145.222
    ↓
Traefik Ingress (port 443)
    ↓
SSL Termination (Let's Encrypt certs)
    ↓
Path-Based Routing
    ├── / → vostra-invoice service → invoice pods (root path)
    └── /api/ → vostra-api service → api pods

User Request (vostra.ai - legacy)
    ↓
Path-Based Routing
    ├── / → vostra-landing service → landing pods
    ├── /vostra-invoice/ → vostra-invoice service → invoice pods
    └── /api/ → vostra-api service → api pods
```

### Port Configuration

- **80 (HTTP)**: Traefik web entrypoint
- **443 (HTTPS)**: Traefik websecure entrypoint
- **8081**: google-eshop (Traefik)
- **8082**: google-eshop (default namespace)
- **8083**: google-eshop (google-eshop namespace)

## Important Notes for Local Development

### When working from your local computer:

1. **Push to deploy**: Just `git push origin main` and GitHub Actions handles everything
2. **No server access needed**: GitHub Actions SSHs to server for you
3. **Path structure**:
   - Local dev: `http://localhost:5173/` (root path)
   - Production: `https://vostrainvoice.se/` (root path)
   - Legacy: `https://vostra.ai/vostra-invoice/` (subpath, transition only)
4. **Test builds locally**:
   ```bash
   cd frontend
   npm run build
   # Test the built files in dist/
   ```

### GitHub Actions Status

Check deployment progress:
- Go to: https://github.com/rcn123/vostra-invoice-web/actions
- Click on latest workflow run
- See real-time deployment logs

### Required GitHub Secrets

Ensure these are set (one-time setup):
- `HETZNER_HOST`: `65.21.145.222`
- `HETZNER_USER`: `root`
- `HETZNER_SSH_KEY`: Your private SSH key from `~/.ssh/id_rsa`

## Technology Stack Details

### Frontend
- **React 18**: UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS
- **Vite**: Build tool and dev server

### Infrastructure
- **k3s**: Lightweight Kubernetes
- **Traefik**: Ingress controller (built into k3s)
- **cert-manager**: SSL certificate management
- **Docker**: Container runtime
- **nginx**: Web server (in containers)

### CI/CD
- **GitHub Actions**: Automated deployments
- **SSH**: Secure deployment to server

## Backend Implementation

### Implementation Progress

- ✅ **Phase 1**: Backend API foundation (database, models, file storage)
- ✅ **Phase 2**: AI extraction service (GPT-4o/GPT-5 + PDF support)
- ✅ **Phase 3**: Service integration (API ↔ AI extractor)
- ✅ **Phase 4**: Additional API endpoints (list, detail, approve, health)
- ✅ **Phase 5**: Frontend integration & UX (connected to real API)
- 🚧 **Phase 6**: Production hardening (monitoring, security, optimization)

See **`cc/invoice-upload-implementation-plan.md`** and **`CLAUDE.md`** for details.

### Production Architecture

```
User Browser (https://vostrainvoice.se/)
    ↓ HTTPS (Let's Encrypt SSL)
Traefik Ingress (Kubernetes)
    ↓
React Frontend (TypeScript) ✅ DEPLOYED (Root Path)
    ├── Type-safe API client (OpenAPI-generated types)
    ├── Toast notifications & ErrorBoundary
    └── Upload, List, Detail, Approve pages
        ↓ /api/* (relative path routing)
vostra-api (FastAPI) ✅ DEPLOYED
    ├── PostgreSQL 15 (invoices, raw_ai_data, user_validated_data) ✅
    ├── File Storage (PersistentVolume) ✅
    ├── POST /upload, GET /list, GET /detail, POST /approve ✅
    └── → vostra-ai-extractor (FastAPI) ✅ DEPLOYED
              ├── GPT-4o Vision API (OpenAI) ✅
              ├── PDF→PNG conversion (PyMuPDF) ✅
              └── Swedish invoice extraction ✅

Kubernetes (k3s on Hetzner)
├── Pods: postgres, vostra-api, vostra-ai-extractor, vostra-invoice (all Running)
├── Services: ClusterIP for internal routing
├── Ingress: Multi-domain routing with SSL (vostrainvoice.se, .com, vostra.ai)
└── PersistentVolumes: Invoice file storage
```

**Status Flow**: `uploaded → extracting → extracted → approved` (or `extraction_failed`)

## Session Continuity

For Claude Code sessions, see **`claude.md`** for:
- Current project status
- What's working vs what needs backend
- Key design decisions
- Troubleshooting guide
- Session-to-session context

## Support

For issues or questions:
- Check logs: `kubectl logs -n vostra -l app=vostra-invoice`
- View status: `kubectl get all -n vostra`
- Certificate issues: `kubectl describe certificate vostra-tls -n vostra`
