from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path

from app.database import get_db
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceResponse
from app.services.file_service import save_uploaded_file
from app.services.ai_client import extract_invoice_data
from app.utils.validators import validate_file

router = APIRouter(prefix="/api/invoices", tags=["invoices"])


@router.post("/upload", response_model=InvoiceResponse, status_code=201)
async def upload_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and extract invoice data

    Flow:
    1. Validate file (type, size)
    2. Save to storage with organized path
    3. Create invoice record (status='uploaded')
    4. Call AI extractor
    5. Update invoice with extracted data (status='extracted')
    6. Return invoice with AI data
    """
    # 1. Validate file
    validate_file(file)

    # 2. Save file to storage
    try:
        relative_path, file_size = await save_uploaded_file(file)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )

    # 3. Create invoice record in database
    file_ext = Path(file.filename).suffix
    invoice = Invoice(
        original_filename=file.filename,
        file_type=file_ext.lstrip('.'),
        file_path=relative_path,
        file_size=file_size,
        status="uploaded"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # 4. Call AI extractor
    try:
        extraction_result = await extract_invoice_data(
            invoice_id=invoice.id,
            file_path=relative_path
        )

        # 5. Update invoice with extracted data
        if extraction_result.get("status") == "success":
            invoice.raw_ai_data = extraction_result.get("raw_ai_data")
            invoice.status = "extracted"
            invoice.extracted_at = datetime.utcnow()
        else:
            invoice.status = "failed"
            invoice.error_message = extraction_result.get("error", "Unknown extraction error")

        db.commit()
        db.refresh(invoice)

    except HTTPException as e:
        # AI service error - mark as failed but don't raise
        invoice.status = "failed"
        invoice.error_message = e.detail
        db.commit()
        db.refresh(invoice)

    except Exception as e:
        # Unexpected error
        invoice.status = "failed"
        invoice.error_message = f"Extraction error: {str(e)}"
        db.commit()
        db.refresh(invoice)

    # 6. Return invoice
    return invoice
