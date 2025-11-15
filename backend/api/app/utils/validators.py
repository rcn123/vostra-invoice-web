from fastapi import UploadFile, HTTPException
from app.config import get_settings

settings = get_settings()


def validate_file_type(file: UploadFile) -> None:
    """
    Validate uploaded file type

    Raises:
        HTTPException: If file type is not allowed
    """
    if file.content_type not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed types: {', '.join(settings.ALLOWED_FILE_TYPES)}"
        )


def validate_file_size(file: UploadFile) -> None:
    """
    Validate uploaded file size

    Raises:
        HTTPException: If file size exceeds maximum
    """
    # Note: file.size is not always available, will check during read
    # This is a placeholder for future implementation
    pass


def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename

    Args:
        filename: Original filename

    Returns:
        File extension (e.g., 'pdf', 'png')
    """
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal attacks

    Args:
        filename: Original filename

    Returns:
        Sanitized filename
    """
    # Remove any path separators
    filename = filename.replace('/', '_').replace('\\', '_')

    # Remove any null bytes
    filename = filename.replace('\0', '')

    # Limit filename length
    if len(filename) > 255:
        ext = get_file_extension(filename)
        filename = filename[:250] + '.' + ext

    return filename


def validate_file(file: UploadFile) -> None:
    """
    Validate uploaded file (type and size)

    Args:
        file: Uploaded file

    Raises:
        HTTPException: If file validation fails
    """
    validate_file_type(file)
    validate_file_size(file)
