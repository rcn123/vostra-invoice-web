from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, BigInteger
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.database import Base


class Invoice(Base):
    """Invoice model for storing uploaded invoices and AI extraction data"""

    __tablename__ = "invoices"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Timestamps (with timezone for UTC storage)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    extracted_at = Column(TIMESTAMP(timezone=True), nullable=True)
    approved_at = Column(TIMESTAMP(timezone=True), nullable=True)

    # Status tracking
    status = Column(
        String(50),
        default="uploaded",
        nullable=False,
        index=True
    )  # uploaded | extracting | extracted | approved | failed

    # File metadata
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)  # 'pdf', 'png', 'xml'
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=True)

    # AI extraction (JSONB for flexibility)
    raw_ai_data = Column(JSONB, nullable=True)

    # User-validated data (JSONB)
    user_validated_data = Column(JSONB, nullable=True)

    # Error tracking
    error_message = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Invoice(id={self.id}, status={self.status}, filename={self.original_filename})>"
