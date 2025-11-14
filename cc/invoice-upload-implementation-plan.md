# Invoice Upload & AI Extraction Implementation Plan (Revised)

**Created:** 2025-11-13
**Revised:** 2025-11-14 (added testing strategy reference)
**Status:** Planning Phase
**Architecture:** Two-Service Pattern (API Backend + AI Extractor)
**Testing:** See `cc/testing-strategy.md` for comprehensive testing approach

---

## Overview

Build a complete invoice processing system with **two separate services**:

1. **vostra-api** (FastAPI): Handles file upload, DB, user approval
2. **vostra-ai-extractor** (FastAPI): Handles AI extraction only (swappable GPT→local LLM)

This separation allows easy switching from OpenAI GPT-4 to local models later without changing the frontend or main backend.

---

## System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│   React     │ ──────> │  vostra-api  │ ──────> │ vostra-ai-       │
│  Frontend   │  HTTP   │   (FastAPI)  │  HTTP   │   extractor      │
└─────────────┘         └──────────────┘         │   (FastAPI)      │
                               │                 └──────────────────┘
                               │                          │
                               ▼                          ▼
                        ┌──────────────┐         ┌──────────────┐
                        │  PostgreSQL  │         │   OpenAI     │
                        │   Database   │         │  GPT-4 API   │
                        └──────────────┘         └──────────────┘
                               │                 (later: local LLM)
                               ▼
                        ┌──────────────┐
                        │ File Storage │
                        │     (PVC)    │
                        └──────────────┘
```

---

## Key Architecture Decisions (from ChatGPT feedback)

✅ **Two separate containers**: vostra-api + vostra-ai-extractor
✅ **Minimal DB schema**: Just invoices + line_items with JSONB fields
✅ **Simple status flow**: uploaded → extracting → extracted → approved → failed
✅ **AI service is swappable**: GPT-4 now, local LLM later, same API contract
✅ **AI service is stateless**: Receives file ref, returns JSON, doesn't touch DB

---

## Database Schema (Simplified)

### invoices table

```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    extracted_at TIMESTAMP,
    approved_at TIMESTAMP,

    -- Status tracking
    status VARCHAR(50) DEFAULT 'uploaded',  -- uploaded | extracting | extracted | approved | failed

    -- File metadata
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,  -- 'pdf', 'png', 'xml'
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,

    -- AI extraction (JSONB)
    raw_ai_data JSONB,  -- Full JSON response from AI extractor

    -- User-validated data (JSONB)
    user_validated_data JSONB,  -- User corrections/approvals

    -- Error tracking
    error_message TEXT
);

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);
```

### line_items table (optional - can also be in JSONB)

```sql
CREATE TABLE line_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,

    line_number INTEGER,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    vat_rate DECIMAL(5, 2),
    vat_amount DECIMAL(12, 2),

    -- AI suggested account
    ai_suggested_account VARCHAR(10),
    ai_account_confidence DECIMAL(5, 4),

    -- User approved account
    user_account VARCHAR(10)
);

CREATE INDEX idx_line_items_invoice_id ON line_items(invoice_id);
```

**Note:** Can start with just JSONB in invoices table, add line_items table later if needed.

---

## Service 1: vostra-api (Main Backend)

### Responsibilities

1. Accept file uploads from frontend
2. Validate files (PDF, PNG, XML)
3. Save files to storage
4. Create invoice record in DB (status: `uploaded`)
5. Call vostra-ai-extractor to extract data
6. Update invoice with `raw_ai_data` (status: `extracted`)
7. Serve invoice data to frontend
8. Accept user corrections/approvals
9. Save `user_validated_data` (status: `approved`)

---

### Directory Structure

```
backend/api/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application
│   ├── config.py                  # Configuration
│   ├── database.py                # SQLAlchemy connection
│   ├── models/
│   │   ├── __init__.py
│   │   └── invoice.py            # Invoice ORM model
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── invoice.py            # Pydantic schemas
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── invoices.py       # Upload, list, get, approve endpoints
│   │       └── health.py         # Health check
│   ├── services/
│   │   ├── __init__.py
│   │   ├── file_service.py       # File upload/storage
│   │   ├── invoice_service.py    # Business logic
│   │   └── ai_client.py          # HTTP client to vostra-ai-extractor
│   └── utils/
│       ├── __init__.py
│       └── validators.py         # File validation
├── alembic/                       # DB migrations
├── storage/                       # Mounted volume for files
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

### API Endpoints (vostra-api)

#### 1. Upload Invoice

**Endpoint:** `POST /api/invoices/upload`

**Request:**
```
Content-Type: multipart/form-data
{
  file: <File>
}
```

**Flow:**
1. Validate file (type, size)
2. Save to storage: `/storage/uploads/YYYY/MM/DD/uuid_filename.ext`
3. Create invoice record: `status = 'uploaded'`
4. Call AI extractor: `POST http://vostra-ai-extractor:8001/extract`
5. Update invoice: `raw_ai_data = {...}, status = 'extracted'`
6. Return invoice

**Response (201):**
```json
{
  "id": 123,
  "status": "extracted",
  "created_at": "2025-11-13T10:00:00Z",
  "extracted_at": "2025-11-13T10:00:05Z",
  "original_filename": "invoice.pdf",
  "raw_ai_data": {
    "invoice_number": "21196546317",
    "invoice_date": "2025-06-09",
    "total": 33813.00,
    "supplier": {...},
    "buyer": {...},
    "lines": [...]
  }
}
```

---

#### 2. Get Invoice

**Endpoint:** `GET /api/invoices/{id}`

**Response:**
```json
{
  "id": 123,
  "status": "extracted",
  "created_at": "2025-11-13T10:00:00Z",
  "extracted_at": "2025-11-13T10:00:05Z",
  "original_filename": "invoice.pdf",
  "raw_ai_data": {...},
  "user_validated_data": null
}
```

---

#### 3. List Invoices

**Endpoint:** `GET /api/invoices?skip=0&limit=20&status=extracted`

**Response:**
```json
{
  "invoices": [...],
  "total": 42
}
```

---

#### 4. Approve Invoice

**Endpoint:** `POST /api/invoices/{id}/approve`

**Request:**
```json
{
  "validated_data": {
    "invoice_number": "corrected-value",
    "lines": [
      {
        "line_number": 1,
        "user_account": "5010"
      }
    ]
  }
}
```

**Flow:**
1. Receive user corrections
2. Merge with `raw_ai_data`
3. Save to `user_validated_data`
4. Update `status = 'approved', approved_at = NOW()`

**Response:**
```json
{
  "id": 123,
  "status": "approved",
  "approved_at": "2025-11-13T10:30:00Z",
  "user_validated_data": {...}
}
```

---

#### 5. Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_extractor": "reachable"
}
```

---

### AI Client (services/ai_client.py)

Calls vostra-ai-extractor service:

```python
import httpx
from app.config import get_settings

settings = get_settings()

async def extract_invoice_data(invoice_id: int, file_path: str) -> dict:
    """
    Call AI extraction service
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.AI_EXTRACTOR_URL}/extract",
            json={
                "invoice_id": invoice_id,
                "file_path": file_path
            },
            timeout=60.0  # AI extraction can take time
        )
        response.raise_for_status()
        return response.json()
```

---

## Service 2: vostra-ai-extractor (AI Extraction)

### Responsibilities

1. Receive file reference (invoice_id + file_path)
2. Load file from storage
3. Call OpenAI GPT-4 Vision (or local LLM later)
4. Parse response into ground-truth JSON format
5. Return structured JSON
6. **Does NOT touch database**

---

### Directory Structure

```
backend/ai-extractor/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application
│   ├── config.py                  # Configuration
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gpt_extractor.py      # OpenAI GPT-4 Vision
│   │   ├── local_extractor.py    # Local LLM (future)
│   │   └── peppol_parser.py      # PEPPOL XML parser
│   └── utils/
│       ├── __init__.py
│       └── file_loader.py        # Load files from storage
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

### API Endpoint (vostra-ai-extractor)

#### POST /extract

**Request:**
```json
{
  "invoice_id": 123,
  "file_path": "/storage/uploads/2025/11/13/uuid_invoice.pdf"
}
```

**Flow:**
1. Load file from `file_path`
2. If XML: Parse PEPPOL structure
3. If PDF/PNG: Convert to base64, call GPT-4 Vision
4. Parse response to ground-truth format
5. Return structured JSON

**Response:**
```json
{
  "invoice_id": 123,
  "status": "success",
  "raw_ai_data": {
    "invoice_number": "21196546317",
    "invoice_date": "2025-06-09",
    "due_date": "2025-06-30",
    "total": 33813.00,
    "currency": "SEK",
    "supplier": {
      "name": "AB Svenska Bostäder",
      "org_number": "556043-6429",
      "address": "Box 95, 16212 Vällingby"
    },
    "buyer": {
      "name": "Sundsvalls Kommun",
      "address": "Storgatan 14, 851 85 Sundsvall"
    },
    "lines": [
      {
        "line_number": 1,
        "description": "Hyra lokal",
        "period": "2025-07-01 – 2025-09-30",
        "amount": 22257.00,
        "vat_rate": 0,
        "vat_amount": 0
      }
    ],
    "vat_breakdown": [
      {
        "rate": 0,
        "taxable_amount": 27050.00,
        "vat_amount": 0
      }
    ]
  }
}
```

**Error Response:**
```json
{
  "invoice_id": 123,
  "status": "failed",
  "error": "Failed to extract: OpenAI API error"
}
```

---

### GPT-4 Vision Extractor (services/gpt_extractor.py)

```python
import openai
import base64
from pathlib import Path
from app.config import get_settings

settings = get_settings()
openai.api_key = settings.OPENAI_API_KEY

async def extract_from_pdf_or_image(file_path: str) -> dict:
    """
    Extract invoice data using GPT-4 Vision
    """
    # Load and encode file
    with open(file_path, "rb") as f:
        file_content = base64.b64encode(f.read()).decode('utf-8')

    # Determine mime type
    ext = Path(file_path).suffix.lower()
    mime_type = "image/png" if ext in ['.png', '.jpg', '.jpeg'] else "application/pdf"

    # Create prompt based on ground-truth-schema.json
    prompt = """
Extract ALL data from this Swedish invoice and return ONLY valid JSON.

Required JSON structure:
{
  "invoice_number": "...",
  "invoice_date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD",
  "total": 0.00,
  "currency": "SEK",
  "supplier": {
    "name": "...",
    "org_number": "XXXXXX-XXXX",
    "address": "..."
  },
  "buyer": {
    "name": "...",
    "address": "..."
  },
  "lines": [
    {
      "line_number": 1,
      "description": "...",
      "amount": 0.00,
      "vat_rate": 0,
      "vat_amount": 0.00
    }
  ],
  "vat_breakdown": [
    {
      "rate": 0,
      "taxable_amount": 0.00,
      "vat_amount": 0.00
    }
  ]
}

Extract ALL visible fields. If a field is missing, omit it. Return ONLY JSON.
"""

    # Call OpenAI
    response = openai.ChatCompletion.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{file_content}"
                        }
                    }
                ]
            }
        ],
        max_tokens=2000,
        temperature=0.1  # Low for consistency
    )

    # Parse JSON response
    import json
    result = json.loads(response.choices[0].message.content)

    return result
```

---

## Complete Workflow

```
1. Frontend uploads file
   ↓
2. vostra-api: POST /api/invoices/upload
   - Validate file
   - Save to /storage/uploads/YYYY/MM/DD/uuid_file.pdf
   - Create DB record: status = 'uploaded'
   ↓
3. vostra-api calls vostra-ai-extractor
   - POST http://vostra-ai-extractor:8001/extract
   - Body: { invoice_id: 123, file_path: "/storage/..." }
   ↓
4. vostra-ai-extractor:
   - Load file
   - Call GPT-4 Vision
   - Parse to ground-truth JSON
   - Return raw_ai_data
   ↓
5. vostra-api:
   - Update DB: raw_ai_data = {...}, status = 'extracted'
   - Return invoice to frontend
   ↓
6. Frontend: GET /api/invoices/123
   - Display raw_ai_data for user review
   ↓
7. User edits/approves
   ↓
8. Frontend: POST /api/invoices/123/approve
   - Body: { validated_data: {...} }
   ↓
9. vostra-api:
   - Save user_validated_data
   - Update status = 'approved'
```

---

## Kubernetes Deployment

### Service 1: PostgreSQL

**File:** `k8s/postgres-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: vostra-invoice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: "vostra-invoice-web"
        - name: POSTGRES_USER
          value: "vostra"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: postgres-password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: vostra-invoice
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: vostra-invoice
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: local-path
```

---

### Service 2: vostra-api

**File:** `k8s/api-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vostra-api
  namespace: vostra-invoice
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vostra-api
  template:
    metadata:
      labels:
        app: vostra-api
    spec:
      containers:
      - name: api
        image: vostra-api:v1
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: database-url
        - name: AI_EXTRACTOR_URL
          value: "http://vostra-ai-extractor:8001"
        volumeMounts:
        - name: storage
          mountPath: /storage
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: storage-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: vostra-api
  namespace: vostra-invoice
spec:
  selector:
    app: vostra-api
  ports:
  - port: 8000
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: storage-pvc
  namespace: vostra-invoice
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 20Gi
  storageClassName: local-path
```

---

### Service 3: vostra-ai-extractor

**File:** `k8s/ai-extractor-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vostra-ai-extractor
  namespace: vostra-invoice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vostra-ai-extractor
  template:
    metadata:
      labels:
        app: vostra-ai-extractor
    spec:
      containers:
      - name: ai-extractor
        image: vostra-ai-extractor:v1
        ports:
        - containerPort: 8001
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: openai-api-key
        - name: OPENAI_MODEL
          value: "gpt-4-vision-preview"
        volumeMounts:
        - name: storage
          mountPath: /storage
          readOnly: true
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: storage-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: vostra-ai-extractor
  namespace: vostra-invoice
spec:
  selector:
    app: vostra-ai-extractor
  ports:
  - port: 8001
```

---

### Secrets

**Method:** GitHub Secrets (deployed via GitHub Actions)

Secrets are managed in GitHub repository settings and automatically deployed to Kubernetes during CI/CD.

**GitHub Secrets to Add:**
1. `DB_PASSWORD` - Strong PostgreSQL password
2. `OPENAI_API_KEY` - OpenAI API key

The deployment workflow automatically creates/updates the `backend-secrets` Kubernetes secret with:
- `postgres-password`
- `database-url` (constructed from DB_PASSWORD)
- `openai-api-key`

**Future:** Consider migrating to HashiCorp Vault for production (see `cc/todo-production.md`)

---

### Updated Ingress

**File:** `k8s/ingress.yaml`

Add API route:

```yaml
- path: /api
  pathType: Prefix
  backend:
    service:
      name: vostra-api
      port:
        number: 8000
```

---

## Frontend Integration

### TypeScript API Client

**File:** `frontend/src/services/api.ts`

```typescript
export interface Invoice {
  id: number;
  status: 'uploaded' | 'extracting' | 'extracted' | 'approved' | 'failed';
  created_at: string;
  extracted_at?: string;
  approved_at?: string;
  original_filename: string;
  raw_ai_data?: any;
  user_validated_data?: any;
  error_message?: string;
}

const API_BASE = 'https://vostra.ai/api';

export const invoiceApi = {
  upload: async (file: File): Promise<Invoice> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/invoices/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  },

  get: async (id: number): Promise<Invoice> => {
    const response = await fetch(`${API_BASE}/invoices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  },

  list: async (params?: { skip?: number; limit?: number; status?: string }): Promise<{ invoices: Invoice[]; total: number }> => {
    const queryParams = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE}/invoices?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  approve: async (id: number, validatedData: any): Promise<Invoice> => {
    const response = await fetch(`${API_BASE}/invoices/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validated_data: validatedData }),
    });
    if (!response.ok) throw new Error('Failed to approve invoice');
    return response.json();
  },
};
```

---

## Implementation Phases

### Phase 1: Database & vostra-api Foundation (Week 1)

**Tasks:**
- [ ] Create `backend/api/` directory structure
- [ ] Set up FastAPI application
- [ ] Create PostgreSQL schema (invoices table)
- [ ] Set up Alembic migrations
- [ ] Create Pydantic schemas
- [ ] Implement file upload endpoint
- [ ] Implement file storage service
- [ ] Test locally with mock AI responses

**Testing:** See `cc/testing-strategy.md` for file upload, validation, and DB integrity tests.

---

### Phase 2: vostra-ai-extractor Service (Week 2)

**Tasks:**
- [ ] Create `backend/ai-extractor/` directory structure
- [ ] Set up FastAPI application
- [ ] Implement `/extract` endpoint
- [ ] Integrate OpenAI GPT-4 Vision
- [ ] Create ground-truth JSON prompt
- [ ] Test with sample invoices
- [ ] Fine-tune prompts for accuracy

**Testing:** See `cc/testing-strategy.md` for extract endpoint and PEPPOL parser tests.

---

### Phase 3: Service Integration (Week 2)

**Tasks:**
- [ ] Create AI client in vostra-api
- [ ] Connect upload flow to AI extractor
- [ ] Implement status tracking (uploaded→extracting→extracted)
- [ ] Add error handling
- [ ] Test end-to-end locally

**Testing:** See `cc/testing-strategy.md` for integration tests (happy path + extractor failure).

---

### Phase 4: Additional API Endpoints (Week 3)

**Tasks:**
- [ ] Implement GET /api/invoices/{id}
- [ ] Implement GET /api/invoices (list with pagination)
- [ ] Implement POST /api/invoices/{id}/approve
- [ ] Implement GET /api/health
- [ ] Add comprehensive error handling

**Testing:** See `cc/testing-strategy.md` for endpoint and error flow tests.

---

### Phase 5: Frontend Integration (Week 3)

**Tasks:**
- [ ] Create TypeScript API client
- [ ] Update UploadPage.tsx with real API
- [ ] Update InvoiceDetailPage.tsx to fetch from API
- [ ] Update InvoiceListPage.tsx to fetch from API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test end-to-end

**Testing:** See `cc/testing-strategy.md` for upload UI and approval UI tests.

---

### Phase 6: Kubernetes Deployment (Week 4)

**Tasks:**
- [ ] Create Dockerfiles for both services
- [ ] Create all K8s manifests
- [ ] Create secrets on production server
- [ ] Update GitHub Actions workflow
- [ ] Deploy to production
- [ ] Test production endpoints
- [ ] Monitor logs and fix issues

---

## Docker Configuration

### vostra-api Dockerfile

**File:** `backend/api/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini .

RUN mkdir -p /storage/uploads /storage/processed

CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**requirements.txt:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-multipart==0.0.6
aiofiles==23.2.1
httpx==0.25.2
python-dotenv==1.0.0
```

---

### vostra-ai-extractor Dockerfile

**File:** `backend/ai-extractor/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

CMD uvicorn app.main:app --host 0.0.0.0 --port 8001
```

**requirements.txt:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.3.5
python-dotenv==1.0.0
```

---

## Updated GitHub Actions

**File:** `.github/workflows/deploy.yml`

```yaml
- name: Deploy to Hetzner Kubernetes
  run: |
    ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no ${{ secrets.HETZNER_USER }}@${{ secrets.HETZNER_HOST }} << 'EOF'
      cd /var/www/vostra-invoice-web

      # Pull latest code
      git pull origin main

      # Build all images
      docker build -t vostra-landing:v1 ./landing
      docker build -t vostra-invoice-frontend:v1 ./frontend
      docker build -t vostra-api:v1 ./backend/api
      docker build -t vostra-ai-extractor:v1 ./backend/ai-extractor

      # Import to k3s
      docker save vostra-landing:v1 | sudo k3s ctr images import -
      docker save vostra-invoice-frontend:v1 | sudo k3s ctr images import -
      docker save vostra-api:v1 | sudo k3s ctr images import -
      docker save vostra-ai-extractor:v1 | sudo k3s ctr images import -

      # Apply manifests
      kubectl apply -f k8s/namespace.yaml
      kubectl apply -f k8s/secrets.yaml
      kubectl apply -f k8s/postgres-deployment.yaml
      kubectl apply -f k8s/api-deployment.yaml
      kubectl apply -f k8s/ai-extractor-deployment.yaml
      kubectl apply -f k8s/landing-deployment.yaml
      kubectl apply -f k8s/invoice-deployment.yaml
      kubectl apply -f k8s/ingress.yaml

      # Restart deployments
      kubectl rollout restart deployment/postgres -n vostra-invoice
      kubectl rollout restart deployment/vostra-api -n vostra-invoice
      kubectl rollout restart deployment/vostra-ai-extractor -n vostra-invoice
      kubectl rollout restart deployment/vostra-landing -n vostra-invoice
      kubectl rollout restart deployment/vostra-invoice -n vostra-invoice

      # Wait for rollouts
      kubectl rollout status deployment/vostra-api -n vostra-invoice --timeout=180s
      kubectl rollout status deployment/vostra-ai-extractor -n vostra-invoice --timeout=180s

      echo "=== Deployment Status ==="
      kubectl get pods -n vostra-invoice
    EOF
```

---

## Complete Checklist

### Backend - vostra-api
- [ ] Directory structure
- [ ] FastAPI app setup
- [ ] Configuration with env vars
- [ ] Database connection
- [ ] Invoice model (SQLAlchemy)
- [ ] Alembic migrations
- [ ] Pydantic schemas
- [ ] File validators
- [ ] File storage service
- [ ] AI client (HTTP to extractor)
- [ ] Upload endpoint
- [ ] Get endpoint
- [ ] List endpoint
- [ ] Approve endpoint
- [ ] Health endpoint
- [ ] Error handling
- [ ] Dockerfile
- [ ] Local testing

### Backend - vostra-ai-extractor
- [ ] Directory structure
- [ ] FastAPI app setup
- [ ] Configuration
- [ ] Extract endpoint
- [ ] File loader utility
- [ ] GPT-4 Vision integration
- [ ] PEPPOL XML parser (optional)
- [ ] Error handling
- [ ] Dockerfile
- [ ] Local testing
- [ ] Test with sample invoices

### Kubernetes
- [ ] PostgreSQL deployment + service + PVC
- [ ] vostra-api deployment + service
- [ ] vostra-ai-extractor deployment + service
- [ ] Storage PVC (shared)
- [ ] Secrets created
- [ ] Ingress updated
- [ ] GitHub Actions updated
- [ ] Production deployment
- [ ] Health checks passing

### Frontend
- [ ] TypeScript API client
- [ ] UploadPage updated
- [ ] InvoiceDetailPage updated
- [ ] InvoiceListPage updated
- [ ] Loading states
- [ ] Error handling
- [ ] End-to-end testing

---

## Next Steps

1. **Start with Phase 1**: Create `backend/api/` structure and basic endpoints
2. Work sequentially through phases
3. Test each component before moving forward
4. Update this plan as needed

---

## Notes

**Why Two Services?**
- **Easy LLM swap**: Replace vostra-ai-extractor with local model without touching main API
- **Separation of concerns**: API handles DB/files, extractor handles AI only
- **Scalability**: Can scale AI extraction independently
- **Cleaner architecture**: Each service has one responsibility

**Database Strategy:**
- Start minimal: Just `invoices` table with JSONB
- Add `line_items` table later if needed
- JSONB gives flexibility for varying invoice formats
- Easy to evolve schema over time
