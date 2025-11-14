1. Your bullets = correct mental model

What you wrote:

UI:

validate file (pdf/png/xml)

send to backend

show extracted values for user approval + allow edits

Server-side:

save incoming pdf

call LLM (GPT-5 now, local later)

return structured JSON to UI

accept corrected/approved data for final storage

DB should store:

original source file

raw data model extracted

user-approved/edited data

👉 That is exactly the right contract. Don’t overcomplicate it.

I’d add just two things:

a status per invoice: uploaded | extracting | extracted | approved | failed

timestamps for created_at, extracted_at, approved_at

That’s plenty for the demo and perfectly compatible with “real product later”.

2. Container question: what you actually should do

Should server side parts of this be running in a container of its own, with a fast api?

Short answer:

Yes, the AI-extraction part should live in its own FastAPI service/container.

The “normal” backend (API facing the frontend + DB) can be its own container.

For the demo, you can still deploy both on the same k3s box – just separate processes & images.

So:

Container A: vostra-api

Handles: upload endpoint, invoice list/detail, saving files, saving raw/user data.

Talks HTTP (or queue) to…

Container B: vostra-ai-extractor

Handles: given a file id/path → call GPT-5 (later Donut/LayoutLMv3) → return JSON.

That gives you an easy GPT→local-LLM swap later without touching UI or main backend.

3. What to tell Claude Code (in English)

Here’s a ready block to paste to Claude so it aligns with this architecture:

We are splitting the backend into two services:

Service 1: API Backend (vostra-api)

Technology: FastAPI

Responsibilities:

Expose HTTP API to the React/Next frontend

Validate and accept file uploads (PDF, PNG, PEPPOL XML)

Store the original file (e.g. on disk/PVC, referenced by path or file_id)

Create an invoice record in the database with status uploaded

Call the AI-extraction service (Service 2) with a reference to the stored file

Update the invoice with:

raw_ai_data (JSON from the model)

user_validated_data once the user has confirmed/edited

Expose endpoints to:

list invoices

get a single invoice (with raw + validated data)

save user corrections/approvals

Database fields per invoice (simplified for now):

id

created_at, updated_at

status (uploaded | extracting | extracted | approved | failed)

file_path (or file_id)

raw_ai_data (JSONB)

user_validated_data (JSONB)

Service 2: AI Extraction Service (vostra-ai-extractor)

Technology: FastAPI (separate container)

Responsibilities:

Given a file reference (path or id), load the file

For now: call OpenAI GPT-5 (Vision) with a prompt and return structured JSON

Later: be swapped to a local LLM (e.g. Donut/LayoutLMv3) without changing its external API

API contract (internal HTTP between Service 1 and 2):

POST /extract

Request:

{
  "invoice_id": 123,
  "file_path": "/storage/uploads/2025/11/13/uuid_invoice.pdf"
}


Response:

{
  "invoice_id": 123,
  "status": "success",
  "raw_ai_data": { ... structured JSON in our ground-truth format ... }
}


The AI service does not talk directly to the database. It only receives a file ref and returns JSON.

Workflow:

Frontend uploads file → vostra-api (POST /api/invoices/upload)

vostra-api saves the file, creates DB row with status = "uploaded"

vostra-api calls vostra-ai-extractor /extract with invoice_id + file_path

vostra-ai-extractor calls GPT-5, parses the output into our ground-truth JSON format, returns raw_ai_data

vostra-api stores raw_ai_data in DB and sets status = "extracted"

Frontend fetches GET /api/invoices/{id} and shows extracted fields for user approval

User edits and approves → frontend sends validated data to POST /api/invoices/{id}/approve

vostra-api stores user_validated_data and sets status = "approved"

Important constraints:

All user-facing text in the frontend must be in Swedish.

The extraction service must be swappable: today GPT-5, tomorrow local Donut/LayoutLMv3, without changing the API contract.

Keep the database schema minimal in v1: one invoice table + line items is enough, plus JSONB fields for raw/validated AI data.

That matches your intent, fixes Claude’s monolith-leaning plan, and sets you up for both the demo and the “real thing” later.


-----
vostra-invoice/
│
├── frontend/            # Next.js
│
├── api-backend/         # FastAPI service 1
│   ├── Dockerfile
│   ├── app/
│   └── ...
│
├── ai-extractor/        # FastAPI service 2 (GPT-5 now, local model later)
│   ├── Dockerfile
│   ├── app/
│   └── ...
│
├── k8s/
│   ├── api-backend.yaml
│   ├── ai-extractor.yaml
│   ├── ingress.yaml
│   └── ...
│
└── README.md