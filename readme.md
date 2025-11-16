# VostraInvoice Web

Public marketing website and demo for VostraInvoice - AI-powered invoice processing for Swedish municipalities and organizations.

**Live at:** https://vostra.ai/vostra-invoice/

## Current Status

### ✅ Live & Working
- **Frontend Demo**: Full invoice management UI with mock data
- **TypeScript**: Complete conversion from JavaScript
- **XAI Features**: Explainable AI with confidence scores and explanations
- **Deployment**: Auto-deploy via GitHub Actions to Kubernetes
- **SSL/HTTPS**: Let's Encrypt with auto-renewal

### ✅ Backend Operational in Production
- **API Service**: FastAPI with PostgreSQL ✅ Live at https://vostra.ai/api
- **AI Extraction**: OpenAI GPT-4o Vision with PDF support ✅ Working
  - Modular extractors for easy model swapping
  - PyMuPDF for PDF→PNG conversion
  - Tested with real Swedish invoices in production
- **Service Integration**: vostra-api ↔ ai-extractor ✅ Phase 3 complete
- **Complete API Endpoints**: ✅ Phase 4 complete (tested locally)
  - POST /api/invoices/upload - Upload & extract invoices
  - GET /api/invoices - List with pagination & filtering
  - GET /api/invoices/{id} - Retrieve single invoice
  - POST /api/invoices/{id}/approve - User approval workflow
  - GET /api/health - Enhanced connectivity checks
- **Production Secrets**: Template-based, declarative management
- See `cc/invoice-upload-implementation-plan.md` for roadmap

### 🚧 In Development
- **Production Deployment**: Deploy Phase 4 endpoints to Kubernetes (Phase 4b)
- **Frontend Integration**: Connect React app to real API (Phase 5)

## Demo Features

Try the live demo at https://vostra.ai/vostra-invoice/

- **Invoice List**: Browse invoices with status, supplier, and amounts
- **Invoice Detail**: View full invoice with line items
- **AI Suggestions**: Multiple account coding options with confidence scores
- **XAI (Explainable AI)**:
  - Visual confidence bars (green/yellow/gray)
  - Clickable explanations showing matched words, history, and reasoning
  - Dynamic updates when changing account selections
- **Swedish Localization**: All text in Swedish for municipal users

## Tech Stack

### Current (Production)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Infrastructure**: Kubernetes (k3s) on Hetzner with Traefik ingress
- **SSL**: Let's Encrypt via cert-manager (auto-renewal)
- **CI/CD**: GitHub Actions → Auto-deploy to k8s

### Backend (Production)
- **API Service**: FastAPI (Python 3.11) ✅ Phase 4 complete - TESTED
- **AI Extraction**: Separate FastAPI service ✅ Phase 3 complete - WORKING
  - Modular architecture (GPT-4o / GPT-5)
  - PDF→PNG conversion via PyMuPDF
  - Comprehensive Swedish extraction prompt
- **Database**: PostgreSQL 15 with JSONB ✅ Deployed in Kubernetes
- **File Storage**: RWO PersistentVolumeClaim (k3s local-path)
- **Secrets**: Template-based declarative management with base64 encoding
- **Status Flow**: uploaded → extracting → extracted → approved (or extraction_failed)
- **Next**: Deploy Phase 4 to production, connect frontend (Phase 5)
- **Future**: Local LLM (easy swap via modular design)

## Project Structure

```
vostra-invoice-web/
├── frontend/                      # React + TypeScript application ✅ LIVE
│   ├── src/
│   │   ├── components/           # Reusable components (AccountDropdown, DemoLayout)
│   │   ├── pages/                # Invoice pages (List, Detail, Upload)
│   │   ├── data/                 # Mock invoice data (mockInvoices.ts)
│   │   └── App.tsx               # Main app with routing
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
- **Landing Page**: https://vostra.ai/
- **Invoice App**: https://vostra.ai/vostra-invoice/
- **SSL**: Valid Let's Encrypt certificate (auto-renews)

### Infrastructure
- **Server**: Hetzner dedicated (65.21.145.222)
- **Cluster**: k3s (Kubernetes)
- **Ingress**: Traefik (ports 80, 443)
- **SSL**: cert-manager + Let's Encrypt
- **Namespace**: `vostra`
- **Replicas**: 2 pods each (landing + invoice)

## Local Development

### Backend Development

**Phase 1 (vostra-api) - Complete ✅**

1. Start PostgreSQL: `cd backend && docker-compose -f docker-compose.dev.yml up -d`
2. Setup environment: `cd backend/api && cp .env.example .env`
3. Install deps: `pip install -r requirements.txt` (use venv recommended)
4. Run migrations: `alembic upgrade head`
5. Start server: `uvicorn app.main:app --reload --port 8000`
6. API docs: http://localhost:8000/docs

**Phase 2 (vostra-ai-extractor) - Complete ✅**

Features:
- Modular extractors (GPT-4o via Chat API, GPT-5 via Responses API)
- PDF support via PyMuPDF (PDF→PNG conversion)
- Comprehensive Swedish extraction prompt
- Easy model switching via .env config

Quick start:
1. Setup venv: `cd backend/ai-extractor && python -m venv venv && .\venv\Scripts\Activate.ps1`
2. Install: `pip install -r requirements.txt` (includes PyMuPDF)
3. Configure: `cp .env.example .env` (add OPENAI_API_KEY, set OPENAI_MODEL=gpt-4o)
4. Start: `uvicorn app.main:app --reload --port 8001`
5. Test: http://localhost:8001/docs (upload PDF invoices directly)

**Phase 3 (Integration) - Next**

Connect vostra-api to ai-extractor service.

### Frontend Development

```bash
cd frontend
npm install

# Generate TypeScript types from backend OpenAPI spec (requires backend running)
npm run generate-types

npm run dev
```

The app will be available at `http://localhost:5173/`

**Note:**
- Local dev runs at `/` but production runs at `/vostra-invoice/`
- Run `npm run generate-types` manually whenever backend schemas change
- Types are generated from `http://localhost:8000/openapi.json`

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
nslookup vostra.ai 8.8.8.8
nslookup www.vostra.ai 8.8.8.8

# Test from server
curl -I https://vostra.ai/
```

## Architecture

### Path-Based Routing

```
https://vostra.ai/
├── /                    → vostra-landing (root landing page)
└── /vostra-invoice/     → vostra-invoice (React app)
```

### Request Flow

```
User Request
    ↓
DNS (vostra.ai → 65.21.145.222)
    ↓
Traefik Ingress (port 443)
    ↓
SSL Termination (Let's Encrypt cert)
    ↓
Path-Based Routing
    ├── / → vostra-landing service → landing pods
    └── /vostra-invoice/ → vostra-invoice service → invoice pods
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
3. **Path differences**:
   - Local dev: `http://localhost:5173/` (root path)
   - Production: `https://vostra.ai/vostra-invoice/` (subpath)
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

### Progress

- ✅ **Phase 1 (vostra-api)**: Database, models, file storage
- ✅ **Phase 2 (vostra-ai-extractor)**: OpenAI Vision (GPT-4o/GPT-5) + PDF support
- 🚧 **Phase 3 (Integration)**: Connect services - NEXT
- 📋 **Phase 4-6**: Additional endpoints, frontend, deployment

See **`cc/invoice-upload-implementation-plan.md`** for complete roadmap.

### Architecture

```
React Frontend
    ↓
vostra-api (FastAPI) ✅
    ├── PostgreSQL (invoices, raw_ai_data, user_validated_data) ✅
    ├── File Storage ✅
    └── → vostra-ai-extractor (FastAPI) ✅
              └── OpenAI GPT-5 Vision API ✅
                  (later: local LLM)
```

**Status Flow**: `uploaded → extracting → extracted → approved → failed`

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
