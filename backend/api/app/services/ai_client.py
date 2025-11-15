import httpx
from fastapi import HTTPException
from app.config import get_settings

settings = get_settings()


async def extract_invoice_data(invoice_id: int, file_path: str) -> dict:
    """
    Call AI extraction service to extract invoice data

    Args:
        invoice_id: Database invoice ID
        file_path: Relative file path (e.g., "2025/11/15/uuid_file.pdf")

    Returns:
        dict with keys:
            - invoice_id: int
            - status: "success" | "failed"
            - raw_ai_data: dict (if success)
            - error: str (if failed)

    Raises:
        HTTPException: If AI service is unreachable or times out
    """
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.AI_EXTRACTOR_URL}/extract",
                json={
                    "invoice_id": invoice_id,
                    "file_path": file_path
                }
            )
            response.raise_for_status()
            return response.json()

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail=f"AI extraction service timeout after 60s for invoice {invoice_id}"
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"AI extraction failed: {e.response.text}"
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI extraction service unreachable: {str(e)}"
        )
