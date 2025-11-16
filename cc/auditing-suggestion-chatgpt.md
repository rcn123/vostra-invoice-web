VostraInvoice – State Model & Audit Logging (Implementation Spec)

Version: 2025-11-16
Purpose: Backend implementation guidance
Audience: Claude Code / developers
Format: Markdown (copy/paste ready)

1. Invoice Workflow States

Use an enum or string constants:

uploaded
extracted
extraction_approved
in_progress
approved
exported
failed_extraction

State meanings

uploaded – file received, awaiting extraction

extracted – AI extraction completed (raw fields ready for human check)

extraction_approved – human confirms extracted fields are correct

in_progress – invoice under processing (AI kontering + human editing)

approved – human approves both extraction + kontering

exported – invoice exported; locked

failed_extraction – extraction process failed (OCR/API/etc.)

2. State Transitions
Primary flow
uploaded → extracted → extraction_approved → in_progress → approved → exported

Failure
uploaded → failed_extraction
extracted → failed_extraction

Rollback logic

Editing fields in approved → return to in_progress

Editing extracted fields in in_progress → return to extracted

Editing extracted fields in extraction_approved → return to extracted

Rules

No editing allowed after exported.

Save-without-approving is allowed in any editable state.

Transition must always produce an audit log entry.

3. Invoice Actions
AI actions

Extraction (OCR/Donut)

Kontering suggestions (Top-3)

Assign model version

Assign rule version

Assign confidence values

Human actions

Edit extracted fields

Edit kontering fields

Save draft (no state change)

Approve extraction

Approve kontering

Reject extraction

Export

Edit after approval → triggers rollback

4. Audit Log Requirements

Use an append-only log table (or JSONL file).
Never overwrite previous entries.

Audit entry structure
{
  "timestamp": "2025-11-16T14:02:13Z",
  "invoice_id": "INV-2025-108",
  "user": "anna.l",
  "action": "edit_field",
  "old_status": "in_progress",
  "new_status": "in_progress",
  "changes": {
    "account": { "from": "6210", "to": "6212" },
    "cost_center": { "from": "1010", "to": "1012" }
  },
  "source": "manual", 
  "model_version": "donut_v0.1",
  "rule_version": "ruleset_2025-03"
}

Required fields

timestamp

invoice_id

user (or “system/AI”)

action

old_status

new_status

changes (delta only — not full JSON)

source (“manual”, “AI-model”, “AI-rule”)

model_version

rule_version

When to create audit entries

Status change

User edits

AI extraction

AI kontering

Export

Rejection

Rollback

5. Invoice Storage (Current State)

Invoice table/document must contain current authoritative values:

SQL-style fields
id (PK)
status
supplier
invoice_no
invoice_date
amount
total_vat
cost_center
project
account
vat_code
rows (JSON)
model_version
rule_version
created_at
updated_at

Notes

Entire invoice state is stored only in this table, not in audit logs.

Audit logs store only diffs, not full snapshots.

6. Backend Implementation Notes
Enforce transitions

Create a helper:

def transition(invoice, new_status, user, changes, action):
    validate_transition(invoice.status, new_status)
    write_audit_entry(...)
    invoice.status = new_status
    apply_changes(invoice, changes)
    save(invoice)

Events that do NOT change state

Save draft → audit entry (action: “save_draft”), state unchanged

Events that change state

Approve extraction → extraction_approved

Run kontering → stays in in_progress

Approve kontering → approved

Export → exported

Edit in approved → back to in_progress

Edit in extraction_approved → back to extracted

7. Frontend Implementation Notes
UI behavior by state
State	Editable?	Buttons
extracted	Yes	Save, Approve Extraction, Reject
extraction_approved	Yes	Run Kontering, Edit Extraction
in_progress	Yes	Save, Approve Kontering
approved	No edits (until user tries → backend downgrades to in_progress)	Export
exported	No	None
Display audit log per invoice:

chronological list

each entry expands to show changed fields

8. Minimal DB Schema (SQL)
invoices
id SERIAL PRIMARY KEY,
status VARCHAR(32) NOT NULL,
data JSONB NOT NULL,       -- full current invoice JSON
model_version VARCHAR(64),
rule_version VARCHAR(64),
created_at TIMESTAMP,
updated_at TIMESTAMP

audit_log
id SERIAL PRIMARY KEY,
invoice_id INTEGER REFERENCES invoices(id),
timestamp TIMESTAMP NOT NULL,
user VARCHAR(128),
action VARCHAR(64),
old_status VARCHAR(32),
new_status VARCHAR(32),
changes JSONB,              -- deltas only
source VARCHAR(32),
model_version VARCHAR(64),
rule_version VARCHAR(64)

9. Export Requirements

After approved, system must allow export of:

full invoice

ERP-compatible CSV/JSON

audit log for that invoice

After exported, invoice becomes locked.

End of Specification