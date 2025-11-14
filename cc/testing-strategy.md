# Testing Strategy (MVP)

**Created:** 2025-11-14
**Status:** Planning Phase
**Philosophy:** Minimum viable tests to deploy confidently — not 3 weeks of work

---

## Overview

This document outlines the essential tests needed for the VostraInvoice backend services. The goal is to have enough test coverage to deploy with confidence, without over-engineering.

**Core Principle:** Test the critical paths, mock external dependencies, fail fast.

---

## Test Stack

| Tool | Purpose |
|------|---------|
| **pytest** | Test framework |
| **pytest-asyncio** | Async test support for FastAPI |
| **httpx TestClient** | Test FastAPI endpoints |
| **pytest-httpx** (or **respx**) | Mock HTTP calls between services |
| **pytest-mocker** | Mock external APIs (OpenAI) |
| **pytest-cov** | Coverage reporting (aim for 80%+) |

---

## 1. vostra-api Tests (Critical)

**Location:** `backend/api/tests/`

### a) File Upload Test
```python
# test_upload_endpoint.py
def test_upload_invoice_success(client, mock_ai_extractor):
    """Upload a valid PDF, verify file storage + DB + status flow"""
    # Arrange
    file = ("invoice.pdf", b"fake-pdf-content", "application/pdf")

    # Act
    response = client.post("/api/invoices/upload", files={"file": file})

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "extracted"
    assert data["original_filename"] == "invoice.pdf"
    assert "raw_ai_data" in data

    # Verify file was saved
    assert os.path.exists(f"/storage/uploads/{data['file_path']}")

    # Verify DB record
    invoice = db.query(Invoice).filter(Invoice.id == data["id"]).first()
    assert invoice.status == "extracted"
    assert invoice.raw_ai_data is not None
```

### b) Validation Tests
```python
def test_upload_invalid_file_type(client):
    """Reject .exe files"""
    file = ("virus.exe", b"malware", "application/x-msdownload")
    response = client.post("/api/invoices/upload", files={"file": file})
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_upload_file_too_large(client):
    """Reject files > max size"""
    large_file = ("huge.pdf", b"x" * (100 * 1024 * 1024 + 1), "application/pdf")
    response = client.post("/api/invoices/upload", files={"file": large_file})
    assert response.status_code == 413
```

### c) DB Integrity Tests
```python
def test_approve_invoice(client, db):
    """Approve endpoint saves user_validated_data without overwriting raw_ai_data"""
    # Create invoice with raw_ai_data
    invoice = create_test_invoice(db, status="extracted", raw_ai_data={"total": 1000})

    # Approve with corrections
    validated = {"total": 1050, "lines": [{"user_account": "5010"}]}
    response = client.post(f"/api/invoices/{invoice.id}/approve", json={"validated_data": validated})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["user_validated_data"] == validated
    assert data["raw_ai_data"]["total"] == 1000  # Not overwritten
    assert data["approved_at"] is not None
```

### d) Error Flow Tests
```python
def test_ai_extractor_returns_500(client, mock_ai_extractor_failure):
    """When AI extractor fails, invoice status = failed"""
    file = ("invoice.pdf", b"pdf-content", "application/pdf")

    # Mock AI extractor to return 500
    mock_ai_extractor_failure.status_code = 500

    response = client.post("/api/invoices/upload", files={"file": file})

    # Invoice should still be created but marked as failed
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "failed"
    assert "error_message" in data

def test_ai_extractor_timeout(client, mock_ai_extractor_timeout):
    """Handle timeout from AI extractor"""
    file = ("invoice.pdf", b"pdf-content", "application/pdf")

    response = client.post("/api/invoices/upload", files={"file": file})

    assert response.status_code == 201
    assert response.json()["status"] == "failed"
```

---

## 2. vostra-ai-extractor Tests

**Location:** `backend/ai-extractor/tests/`

### a) Extract Endpoint Test
```python
# test_extract_endpoint.py
def test_extract_endpoint_success(client, mock_gpt_response):
    """Given file path, return structured JSON"""
    request = {
        "invoice_id": 123,
        "file_path": "/storage/uploads/2025/11/14/test.pdf"
    }

    # Mock GPT to return valid JSON
    mock_gpt_response.return_value = {
        "invoice_number": "INV-001",
        "total": 1000,
        "lines": [{"description": "Service", "amount": 1000}]
    }

    response = client.post("/extract", json=request)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["raw_ai_data"]["invoice_number"] == "INV-001"
```

### b) PEPPOL Parser Test
```python
def test_parse_peppol_xml():
    """Parse PEPPOL XML to ground-truth JSON"""
    xml_content = """<?xml version="1.0"?>
    <Invoice>
      <ID>21196546317</ID>
      <IssueDate>2025-06-09</IssueDate>
      ...
    </Invoice>"""

    result = parse_peppol_xml(xml_content)

    assert result["invoice_number"] == "21196546317"
    assert result["invoice_date"] == "2025-06-09"
```

### c) GPT Integration Smoke Test
```python
@pytest.mark.integration
def test_gpt_vision_real_call():
    """Smoke test: real GPT call doesn't crash (run sparingly)"""
    file_path = "tests/fixtures/sample-invoice.pdf"

    result = extract_from_pdf_or_image(file_path)

    # Just verify it returns something structured
    assert "invoice_number" in result or "total" in result
```

---

## 3. Frontend Tests (Minimal)

**Location:** `frontend/src/tests/`

### a) Upload Component Test
```typescript
// UploadPage.test.tsx
test('uploads file and shows success', async () => {
  const mockApi = jest.fn().mockResolvedValue({ id: 123, status: 'extracted' });

  render(<UploadPage api={mockApi} />);

  const file = new File(['pdf'], 'invoice.pdf', { type: 'application/pdf' });
  const input = screen.getByLabelText('Upload invoice');

  await userEvent.upload(input, file);

  expect(mockApi).toHaveBeenCalledWith(file);
  expect(screen.getByText('Upload successful')).toBeInTheDocument();
});
```

### b) Approval UI Test
```typescript
// InvoiceDetailPage.test.tsx
test('approve button sends validated data', async () => {
  const mockApprove = jest.fn();
  const invoice = { id: 123, status: 'extracted', raw_ai_data: {...} };

  render(<InvoiceDetailPage invoice={invoice} onApprove={mockApprove} />);

  // User edits account field
  await userEvent.type(screen.getByLabelText('Konto'), '5010');

  // Click approve
  await userEvent.click(screen.getByText('Godkänn'));

  expect(mockApprove).toHaveBeenCalledWith({
    validated_data: { lines: [{ user_account: '5010' }] }
  });
});
```

---

## 4. Integration Tests (End-to-End)

**Location:** `backend/tests/integration/`

### Test 1: Happy Path
```python
def test_full_invoice_workflow(client, mock_ai_extractor, db):
    """Upload → Extract → Approve"""
    # 1. Upload file
    file = ("invoice.pdf", b"pdf-content", "application/pdf")
    response = client.post("/api/invoices/upload", files={"file": file})
    assert response.status_code == 201
    invoice_id = response.json()["id"]

    # 2. Verify extraction happened
    invoice = client.get(f"/api/invoices/{invoice_id}").json()
    assert invoice["status"] == "extracted"
    assert invoice["raw_ai_data"] is not None

    # 3. Approve
    validated = {"total": 1000}
    response = client.post(f"/api/invoices/{invoice_id}/approve", json={"validated_data": validated})
    assert response.status_code == 200
    assert response.json()["status"] == "approved"
```

### Test 2: Extractor Failure
```python
def test_extractor_failure_workflow(client, mock_ai_extractor_500):
    """Upload → Extractor fails → status=failed"""
    file = ("invoice.pdf", b"pdf-content", "application/pdf")

    response = client.post("/api/invoices/upload", files={"file": file})

    assert response.status_code == 201
    invoice = response.json()
    assert invoice["status"] == "failed"
    assert "error_message" in invoice

    # Verify frontend can still fetch it
    get_response = client.get(f"/api/invoices/{invoice['id']}")
    assert get_response.status_code == 200
```

---

## 5. Mocking Strategy

### Mock AI Extractor HTTP Calls (in vostra-api tests)
```python
# conftest.py
import pytest
from pytest_httpx import HTTPXMock

@pytest.fixture
def mock_ai_extractor(httpx_mock: HTTPXMock):
    """Mock successful AI extractor response"""
    httpx_mock.add_response(
        url="http://vostra-ai-extractor:8001/extract",
        method="POST",
        json={
            "invoice_id": 123,
            "status": "success",
            "raw_ai_data": {
                "invoice_number": "INV-001",
                "total": 1000,
                "lines": []
            }
        }
    )
    return httpx_mock

@pytest.fixture
def mock_ai_extractor_failure(httpx_mock: HTTPXMock):
    """Mock AI extractor 500 error"""
    httpx_mock.add_response(
        url="http://vostra-ai-extractor:8001/extract",
        method="POST",
        status_code=500
    )
    return httpx_mock
```

### Mock OpenAI GPT Calls (in vostra-ai-extractor tests)
```python
# conftest.py
import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_gpt_response():
    """Mock OpenAI GPT-4 Vision response"""
    with patch('openai.ChatCompletion.create') as mock:
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(message=MagicMock(content='{"invoice_number": "INV-001", "total": 1000}'))
        ]
        mock.return_value = mock_response
        yield mock
```

### Mock Frontend API (MSW - Mock Service Worker)
```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/invoices/upload', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: 123, status: 'extracted', raw_ai_data: {...} })
    );
  }),

  rest.get('/api/invoices/:id', (req, res, ctx) => {
    return res(
      ctx.json({ id: 123, status: 'extracted', raw_ai_data: {...} })
    );
  }),
];
```

---

## 6. Test Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| vostra-api | 80%+ |
| vostra-ai-extractor | 75%+ |
| Frontend | 60%+ (critical paths only) |

### Run Coverage
```bash
# Backend
cd backend/api
pytest --cov=app --cov-report=html

cd backend/ai-extractor
pytest --cov=app --cov-report=html

# Frontend
cd frontend
npm run test:coverage
```

---

## 7. CI/CD Integration (GitHub Actions)

Add to `.github/workflows/deploy.yml`:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd backend/api
          pip install -r requirements.txt -r requirements-dev.txt

      - name: Run API tests
        run: |
          cd backend/api
          pytest --cov=app --cov-fail-under=80

      - name: Run AI Extractor tests
        run: |
          cd backend/ai-extractor
          pytest --cov=app --cov-fail-under=75
```

---

## 8. Test Checklist by Phase

### Phase 1: vostra-api Foundation
- [ ] File upload endpoint test
- [ ] File validation tests (type, size)
- [ ] DB CRUD tests
- [ ] Mock AI extractor fixture

### Phase 2: vostra-ai-extractor
- [ ] Extract endpoint test (mocked GPT)
- [ ] PEPPOL parser test
- [ ] 1-2 GPT smoke tests

### Phase 3: Service Integration
- [ ] Integration test: happy path
- [ ] Integration test: extractor failure
- [ ] Mock HTTP between services

### Phase 5: Frontend Integration
- [ ] Upload UI test
- [ ] Approval UI test
- [ ] MSW setup

---

## 9. Later: Pre-Production Tests (Optional)

### Load Testing
```bash
# Use locust or k6
locust -f locustfile.py --host=https://vostra.ai/api
```

Test scenarios:
- 5-10 concurrent file uploads/sec
- Verify DB doesn't choke
- Verify storage handles volume

### Security Scanning
```bash
# Trivy: scan Docker images
trivy image vostra-api:v1

# OWASP ZAP: scan API endpoints
zap-baseline.py -t https://vostra.ai/api
```

---

## Summary: Minimum Viable Tests

**Must have before deploying:**

1. ✅ **vostra-api**: Upload, validation, DB integrity, error flow
2. ✅ **vostra-ai-extractor**: Extract endpoint (mocked GPT), PEPPOL parser
3. ✅ **Integration**: Happy path + extractor failure
4. ✅ **Mocking**: respx for HTTP, pytest-mocker for GPT

**Nice to have later:**
- Load testing
- Security scans
- More comprehensive frontend tests

**Philosophy:** Ship confidently with essential tests, iterate based on real usage.
