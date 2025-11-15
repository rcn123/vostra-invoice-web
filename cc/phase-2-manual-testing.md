# Phase 2 Manual Testing Guide

**Created:** 2025-11-14
**Purpose:** Manual testing of vostra-ai-extractor service
**Environment:** PowerShell (Windows)

---

## Setup

### 1. Virtual Environment

```powershell
cd C:\Users\Robert\source\repos\vostra-invoice-web\backend\ai-extractor
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Execution policy error?** Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Configure Environment

```powershell
Copy-Item .env.example .env
notepad .env
```

Edit `.env`:
```env
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_MODEL=gpt-5
STORAGE_PATH=./storage/vostra-invoice-web/uploads
ENVIRONMENT=development
```

### 4. Create Storage Directory

```powershell
New-Item -ItemType Directory -Force -Path "storage\vostra-invoice-web\uploads\2025\11\15"
```

### 5. Add Test Invoice (Optional)

```powershell
Copy-Item "C:\path\to\test-invoice.pdf" "storage\vostra-invoice-web\uploads\2025\11\15\test-invoice.pdf"
```

---

## Testing

### Start Server

```powershell
uvicorn app.main:app --reload --port 8001
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8001
INFO:     Application startup complete.
```

### Test Endpoints

**1. Root:** http://localhost:8001/
```json
{"message": "Vostra AI Extractor", "version": "1.0.0", "status": "running", "model": "gpt-5"}
```

**2. Health:** http://localhost:8001/health
```json
{"status": "healthy", "model": "gpt-5", "openai_configured": true}
```

**3. Swagger UI:** http://localhost:8001/docs

**4. Test /extract (Swagger UI):**
- Click POST /extract → Try it out
- Without file:
  ```json
  {"invoice_id": 1, "file_path": "2025/11/15/nonexistent.pdf"}
  ```
  Expected: `"status": "failed", "error": "File not found"`

- With real invoice:
  ```json
  {"invoice_id": 1, "file_path": "2025/11/15/test-invoice.pdf"}
  ```
  Expected: `"status": "success"` with extracted JSON data

**5. PowerShell Alternative:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8001/health" -Method Get | ConvertTo-Json

$body = @{invoice_id = 1; file_path = "2025/11/15/test-invoice.pdf"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8001/extract" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10
```

---

## Troubleshooting

**openai_configured: false**
- Check `.env` exists: `Get-Content .env`
- Verify API key set correctly
- Restart server

**Module not found**
- Check `(venv)` in prompt
- Reactivate: `.\venv\Scripts\Activate.ps1`
- Reinstall: `pip install -r requirements.txt`

**Port 8001 in use**
```powershell
Get-NetTCPConnection -LocalPort 8001 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

**OpenAI API errors**
- Verify API key: https://platform.openai.com/api-keys
- Check usage/credits: https://platform.openai.com/usage
- Confirm model is `gpt-5` in `.env`

---

## Success Criteria

✅ Server starts without errors
✅ Health check returns `openai_configured: true`
✅ Swagger UI loads at `/docs`
✅ File validation works (404 for missing files)
✅ Extraction works (correct JSON structure with invoice data)
✅ Dates in YYYY-MM-DD format, amounts accurate

---

## Cleanup

```powershell
# Stop server: CTRL+C
deactivate
```

---

## Next Steps

Report results → Ready for Phase 3 (connect vostra-api to ai-extractor)
