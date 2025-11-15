"""
Router for OpenAI extraction - delegates to appropriate extractor based on model
"""
from pathlib import Path
from fastapi import HTTPException
from app.config import get_settings

settings = get_settings()


async def extract_from_pdf_or_image(file_path: str, base64_content: str, mime_type: str) -> dict:
    """
    DEPRECATED: Old signature for backward compatibility
    Redirects to new implementation based on model

    Args:
        file_path: Relative file path (for logging)
        base64_content: Base64 encoded file content (unused in new implementation)
        mime_type: MIME type of the file (unused in new implementation)

    Returns:
        Extracted invoice data as dictionary

    Raises:
        HTTPException: If extraction fails
    """
    # Construct full path from relative path
    full_path = Path(settings.STORAGE_PATH) / file_path

    if not full_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {file_path}"
        )

    return await extract_invoice(str(full_path))


async def extract_invoice(full_file_path: str) -> dict:
    """
    Extract invoice data using appropriate OpenAI model

    Routes to GPT-4 or GPT-5 extractor based on OPENAI_MODEL setting

    Args:
        full_file_path: Full path to invoice file (PDF or image)

    Returns:
        Extracted invoice data as dictionary

    Raises:
        HTTPException: If extraction fails
    """
    model = settings.OPENAI_MODEL.lower()

    if model.startswith("gpt-5"):
        # Use GPT-5 Responses API
        from app.services.gpt5_extractor import extract_with_gpt5
        return await extract_with_gpt5(full_file_path)

    elif model.startswith("gpt-4"):
        # Use GPT-4 Chat Completions API
        from app.services.gpt4_extractor import extract_with_gpt4
        return await extract_with_gpt4(full_file_path)

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported model: {settings.OPENAI_MODEL}. Use gpt-4o or gpt-5."
        )
