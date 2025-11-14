from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


class InvoiceBase(BaseModel):
    """Base schema for Invoice"""
    original_filename: str
    file_type: str


class InvoiceCreate(InvoiceBase):
    """Schema for creating an invoice"""
    file_path: str
    file_size: Optional[int] = None


class InvoiceUpdate(BaseModel):
    """Schema for updating invoice data"""
    status: Optional[str] = None
    raw_ai_data: Optional[dict[str, Any]] = None
    user_validated_data: Optional[dict[str, Any]] = None
    error_message: Optional[str] = None


class InvoiceApprove(BaseModel):
    """Schema for approving invoice with user corrections"""
    validated_data: dict[str, Any]


class InvoiceResponse(BaseModel):
    """Schema for invoice response"""
    id: int
    created_at: datetime
    updated_at: datetime
    extracted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None

    status: str

    original_filename: str
    file_type: str
    file_path: str
    file_size: Optional[int] = None

    raw_ai_data: Optional[dict[str, Any]] = None
    user_validated_data: Optional[dict[str, Any]] = None

    error_message: Optional[str] = None

    class Config:
        from_attributes = True


class InvoiceListResponse(BaseModel):
    """Schema for paginated invoice list"""
    invoices: list[InvoiceResponse]
    total: int
