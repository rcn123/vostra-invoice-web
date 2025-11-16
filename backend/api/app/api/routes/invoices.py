from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path

from app.database import get_db
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceResponse, InvoiceListResponse, InvoiceApprove
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
            invoice.status = "extraction_failed"
            invoice.error_message = extraction_result.get("error", "Unknown extraction error")

        db.commit()
        db.refresh(invoice)

    except HTTPException as e:
        # AI service error - mark as extraction_failed but don't raise
        invoice.status = "extraction_failed"
        invoice.error_message = e.detail
        db.commit()
        db.refresh(invoice)

    except Exception as e:
        # Unexpected error
        invoice.status = "extraction_failed"
        invoice.error_message = f"Extraction error: {str(e)}"
        db.commit()
        db.refresh(invoice)

    # 6. Return invoice
    return invoice


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single invoice by ID

    Args:
        invoice_id: Invoice ID to retrieve

    Returns:
        Invoice data with all fields

    Raises:
        404: Invoice not found
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with id {invoice_id} not found"
        )

    return invoice


@router.get("", response_model=InvoiceListResponse)
async def list_invoices(
    skip: int = 0,
    limit: int = 20,
    status: str = None,
    db: Session = Depends(get_db)
):
    """
    List invoices with pagination and optional filtering

    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 20, max: 100)
        status: Filter by status (optional): uploaded, extracting, extracted, approved, extraction_failed

    Returns:
        InvoiceListResponse with invoices array and total count
    """
    # Validate limit
    if limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit cannot exceed 100"
        )

    # Build query
    query = db.query(Invoice)

    # Apply status filter if provided
    if status:
        valid_statuses = ["uploaded", "extracting", "extracted", "approved", "extraction_failed"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        query = query.filter(Invoice.status == status)

    # Get total count
    total = query.count()

    # Apply pagination and ordering (newest first)
    invoices = query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()

    return InvoiceListResponse(
        invoices=invoices,
        total=total
    )


@router.post("/{invoice_id}/approve", response_model=InvoiceResponse)
async def approve_invoice(
    invoice_id: int,
    approval_data: InvoiceApprove,
    db: Session = Depends(get_db)
):
    """
    Approve invoice with user corrections/validations

    Flow:
    1. Retrieve invoice from database
    2. Validate invoice exists and is in 'extracted' status
    3. Save user-validated data (corrections/approvals)
    4. Update status to 'approved'
    5. Set approved_at timestamp
    6. Return updated invoice

    Args:
        invoice_id: Invoice ID to approve
        approval_data: User corrections and validated data

    Returns:
        Updated invoice with status='approved'

    Raises:
        404: Invoice not found
        400: Invoice not in correct status for approval
    """
    # 1. Retrieve invoice
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with id {invoice_id} not found"
        )

    # 2. Validate status - can only approve extracted invoices
    if invoice.status == "extraction_failed":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve invoice with status 'extraction_failed'. Extraction must succeed before approval."
        )

    if invoice.status != "extracted":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve invoice with status '{invoice.status}'. Only 'extracted' invoices can be approved."
        )

    # 3. Save user-validated data
    invoice.user_validated_data = approval_data.validated_data

    # 4. Update status to approved
    invoice.status = "approved"

    # 5. Set approved_at timestamp
    invoice.approved_at = datetime.utcnow()

    # Commit changes
    db.commit()
    db.refresh(invoice)

    # 6. Return updated invoice
    return invoice


@router.delete("/{invoice_id}", status_code=204)
async def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete invoice by ID

    ⚠️ DEV ONLY: This endpoint will be removed/restricted in production.
    Currently used for cleaning up test data during development.
    In production, use soft delete (archive/status change) instead.

    Args:
        invoice_id: Invoice ID to delete

    Returns:
        204 No Content on success

    Raises:
        404: Invoice not found
    """
    # Retrieve invoice
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with id {invoice_id} not found"
        )

    # Delete associated file from storage (if exists)
    if invoice.file_path:
        try:
            file_service = FileService()
            file_service.delete_file(invoice.file_path)
        except Exception as e:
            # Log but don't fail - file might already be deleted
            print(f"Warning: Could not delete file {invoice.file_path}: {e}")

    # Delete from database
    db.delete(invoice)
    db.commit()

    # 204 No Content - successful deletion
    return
