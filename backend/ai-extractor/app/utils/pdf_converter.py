import base64
import fitz  # PyMuPDF


def pdf_to_base64(file_path: str, dpi: int = 200) -> str:
    """
    Convert PDF first page to PNG image and encode as base64

    Args:
        file_path: Full path to PDF file
        dpi: Resolution for image conversion (default 200)

    Returns:
        Base64 encoded PNG image string

    Raises:
        ValueError: If PDF has no pages
        Exception: If conversion fails
    """
    doc = fitz.open(file_path)

    if len(doc) == 0:
        doc.close()
        raise ValueError(f"PDF has no pages: {file_path}")

    # Get first page
    page = doc[0]

    # Convert to high-res image
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    # Convert to PNG bytes
    png_bytes = pix.tobytes("png")
    doc.close()

    # Encode to base64
    return base64.b64encode(png_bytes).decode("utf-8")
