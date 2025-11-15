from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
from app.config import get_settings
from app.services.openai_extractor import extract_from_pdf_or_image
from app.utils.file_loader import load_file_as_base64, load_xml_file

settings = get_settings()

# Create FastAPI application
app = FastAPI(
    title="Vostra AI Extractor",
    description="AI-powered invoice data extraction service",
    version="1.0.0"
)


class ExtractRequest(BaseModel):
    """Request model for extraction"""
    invoice_id: int
    file_path: str


class ExtractResponse(BaseModel):
    """Response model for extraction"""
    invoice_id: int
    status: str  # "success" | "failed"
    raw_ai_data: dict | None = None
    error: str | None = None


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Vostra AI Extractor",
        "version": "1.0.0",
        "status": "running",
        "model": settings.OPENAI_MODEL
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": settings.OPENAI_MODEL,
        "openai_configured": bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "sk-your-openai-api-key-here")
    }


@app.post("/extract", response_model=ExtractResponse)
async def extract_invoice(request: ExtractRequest):
    """
    Extract invoice data from uploaded file

    Process:
    1. Load file from storage
    2. Determine file type (PDF/PNG vs XML)
    3. Call appropriate extractor (OpenAI Vision vs PEPPOL parser)
    4. Return structured JSON

    Args:
        request: ExtractRequest with invoice_id and file_path

    Returns:
        ExtractResponse with extracted data or error
    """
    try:
        # Determine file type from extension
        file_ext = Path(request.file_path).suffix.lower()

        if file_ext in ['.xml']:
            # TODO: Implement PEPPOL XML parser
            # xml_content = load_xml_file(request.file_path)
            # raw_ai_data = parse_peppol_xml(xml_content)
            return ExtractResponse(
                invoice_id=request.invoice_id,
                status="failed",
                error="PEPPOL XML parsing not yet implemented"
            )

        elif file_ext in ['.pdf', '.png', '.jpg', '.jpeg']:
            # Load file and extract with OpenAI Vision
            base64_content, mime_type = load_file_as_base64(request.file_path)

            raw_ai_data = await extract_from_pdf_or_image(
                request.file_path,
                base64_content,
                mime_type
            )

            return ExtractResponse(
                invoice_id=request.invoice_id,
                status="success",
                raw_ai_data=raw_ai_data
            )

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_ext}"
            )

    except HTTPException:
        raise
    except Exception as e:
        return ExtractResponse(
            invoice_id=request.invoice_id,
            status="failed",
            error=str(e)
        )
