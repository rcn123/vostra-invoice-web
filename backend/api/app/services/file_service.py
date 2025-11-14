import os
import aiofiles
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile, HTTPException
from app.config import get_settings
from app.utils.validators import sanitize_filename, get_file_extension

settings = get_settings()


async def save_uploaded_file(file: UploadFile) -> tuple[str, int]:
    """
    Save uploaded file to storage

    Args:
        file: Uploaded file

    Returns:
        Tuple of (file_path, file_size)

    Raises:
        HTTPException: If file save fails
    """
    try:
        # Generate file path: /storage/uploads/YYYY/MM/DD/uuid_filename.ext
        now = datetime.now()
        date_path = now.strftime("%Y/%m/%d")

        # Create unique filename
        sanitized = sanitize_filename(file.filename)
        ext = get_file_extension(sanitized)
        unique_filename = f"{uuid4()}_{sanitized}"

        # Full path
        full_dir = Path(settings.STORAGE_PATH) / date_path
        full_dir.mkdir(parents=True, exist_ok=True)

        file_path = full_dir / unique_filename
        relative_path = f"{date_path}/{unique_filename}"

        # Read and save file
        content = await file.read()
        file_size = len(content)

        # Check file size
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large: {file_size} bytes. Maximum: {settings.MAX_FILE_SIZE} bytes"
            )

        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)

        return str(relative_path), file_size

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )


async def delete_file(file_path: str) -> None:
    """
    Delete file from storage

    Args:
        file_path: Relative file path
    """
    try:
        full_path = Path(settings.STORAGE_PATH) / file_path
        if full_path.exists():
            full_path.unlink()
    except Exception as e:
        # Log error but don't fail
        print(f"Failed to delete file {file_path}: {str(e)}")


def get_full_file_path(relative_path: str) -> Path:
    """
    Get full file path from relative path

    Args:
        relative_path: Relative file path

    Returns:
        Full Path object
    """
    return Path(settings.STORAGE_PATH) / relative_path


async def file_exists(relative_path: str) -> bool:
    """
    Check if file exists in storage

    Args:
        relative_path: Relative file path

    Returns:
        True if file exists
    """
    return get_full_file_path(relative_path).exists()
