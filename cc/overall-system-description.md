ostraInvoice Demo (English, but all UI text in Swedish)

Below is a concise but complete description of the demo application we want to build.
The purpose is to create a functional demo that looks and feels like a production system for AI-assisted invoice coding ("AI-kontering") targeted at Swedish municipalities, specifically matching the requirements from Timrå Kommun (UH-2025-280).

1. High-Level Purpose

The demo should simulate a full end-to-end workflow:

User uploads an invoice (PDF or image).

AI step 1 (Extraktion): GPT-5 Vision extracts invoice data → produces a raw JSON structure ("rådata").

AI step 2 (Kontering): A second AI module predicts:

BAS-konto (main account)

cost center / project (simulated)

confidence score

explanation (simulated)

The invoice is stored and shown in an invoice list ("fakturagrid").

User can open invoice details, review each row, approve or correct the suggested account.

Feedback is stored (NOT used for actual retraining in demo, only simulated).

User can export invoice data (CSV, JSON).

The UI is simple, clean, and all visible text for the user must be in Swedish.

2. User Personas

The typical user is an invoice handler ("handläggare") in a Swedish municipality.

UI needs to feel:

trustworthy

calm

business-like

Swedish government tone

table-driven

not flashy or “startup-y”

Think: Fortnox + Visma Proceedo + kommunal förvaltning.

3. Core Functionalities
3.1 Upload & Extraction

User uploads:

PDF (text or image)

PNG/JPG

The backend calls GPT-5 Vision to extract:

header data (supplier, invoice number, date, total, VAT)

all invoice lines (quantity, description, price, VAT, line total)

The extracted JSON is stored.

User sees a message in Swedish:

”Fakturan har lästs in och tolkats.”

3.2 Duplicate Detection (Simulated)

Check:
leverantör + fakturanummer + belopp + datum

If duplicate:
Show Swedish warning:

”Den här fakturan verkar vara en dubblett.”

3.3 Invoice List ("Fakturagrid")

Columns (all Swedish):

Leverantör

Fakturanummer

Datum

Belopp

Status (ex: ”Klart”, ”Granskas”, ”Behöver åtgärd”)

User can click ”Visa detaljer”.

3.4 Invoice Detail View

This is the main part.

Show:

Supplier info

Invoice metadata

All invoice lines in a table

Extracted AI prediction for each line

Columns for each line:

Beskrivning

Belopp

Mängd

Enhetspris

Moms

AI-förslag: BAS-konto (dropdown to change)

Sannolikhet (confidence score)

”Förklaring” (short text: why the model predicted this — simulated)

User actions:

✔ ”Godkänn” (approve AI suggestion)
✔ ”Korrigera” (change account)

When the user modifies anything, store feedback event.

Show message:

”Tack! Ditt val har sparats och används för att förbättra modellen.”

3.5 Export

Available exports:

CSV

JSON

UI texts (Swedish):

”Exportera som CSV”

”Exportera som JSON”

3.6 Feedback Simulation Engine

No real ML retraining.

But:

store corrections in a feedback table

next time a similar invoice is uploaded, the AI suggestion is overridden with the user-chosen account

confidence is artificially increased

This simulates:

learning loop

drift reduction

improved accuracy

In UI:
Show simple panel:

”Korrekt AI-förslag: 82 %”

”Antal feedbackhändelser: 14”

”Senaste förbättring: 2025-11-08”

4. Technical Architecture
Frontend

Next.js or React (Claude can choose)

Tailwind (Claude can autogenerate components)

All user-visible text must be in Swedish

Backend

Node.js (or Python/FastAPI — flexible)

Endpoints roughly:

POST /upload-invoice
GET /invoices
GET /invoices/{id}
POST /invoices/{id}/feedback
GET /export/{id}?format=csv|json

AI Modules

AI1 — Extraction: GPT-5 Vision
AI2 — Coding: simulated ML, simple rule + history + text match

Later replaced by Donut/LayoutLMv3.

5. Visual Style Guidance for Claude

Clean Scandinavian design

Minimal color, mostly grayscale

Thin borders, generous spacing

Components should look like:

Fortnox

Kivra Business

Visma Proceedo

Any Swedish municipal intranet

Avoid:

gradients

bright colors

mobile-app aesthetic

Use Swedish labels everywhere.

6. UI Text Examples (Swedish)

Here’s a set of common texts so Claude understands the tone:

Upload page

”Ladda upp faktura”

”Dra och släpp en fil här”

”Stöd för PDF, PNG och JPG”

Invoice grid

”Fakturor”

”Leverantör”

”Fakturanummer”

”Belopp”

”Visa detaljer”

Detail page

”Fakturadetaljer”

”AI-förslag”

”Sannolikhet”

”Korrigera konto”

”Godkänn rad”

”Ditt val har sparats”

This ensures consistent Swedish UI.

7. What Claude Code Should Focus On

Discussing layout for:

upload page

invoice list grid

invoice detail view

table for invoice rows

feedback panel

export buttons

explanation popovers

Suggesting React component structure

Suggesting data model

Suggesting API endpoints

Proposing CSS/Tailwind patterns

Designing flow between pages

All UI hardcoded text must be Swedish.