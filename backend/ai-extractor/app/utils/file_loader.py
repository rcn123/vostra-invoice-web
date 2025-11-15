import base64
from pathlib import Path
from fastapi import HTTPException
from app.config import get_settings

settings = get_settings()


def load_file_as_base64(file_path: str) -> tuple[str, str]:
    """
    Load file from storage and convert to base64

    Args:
        file_path: Relative file path (e.g., "2025/11/14/uuid_invoice.pdf")

    Returns:
        Tuple of (base64_content, mime_type)

    Raises:
        HTTPException: If file not found or cannot be read
    """
    try:
        # Construct full path
        full_path = Path(settings.STORAGE_PATH) / file_path

        if not full_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File not found: {file_path}"
            )

        # Read and encode file
        with open(full_path, "rb") as f:
            file_content = f.read()

        base64_content = base64.b64encode(file_content).decode('utf-8')

        # Determine MIME type from extension
        ext = full_path.suffix.lower()
        mime_types = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.xml': 'application/xml',
        }
        mime_type = mime_types.get(ext, 'application/octet-stream')

        return base64_content, mime_type

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load file: {str(e)}"
        )


def load_xml_file(file_path: str) -> str:
    """
    Load XML file from storage

    Args:
        file_path: Relative file path

    Returns:
        XML content as string

    Raises:
        HTTPException: If file not found or cannot be read
    """
    try:
        full_path = Path(settings.STORAGE_PATH) / file_path

        if not full_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File not found: {file_path}"
            )

        with open(full_path, "r", encoding="utf-8") as f:
            return f.read()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load XML file: {str(e)}"
        )
