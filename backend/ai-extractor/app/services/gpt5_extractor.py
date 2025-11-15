import json
from pathlib import Path
from openai import OpenAI
from fastapi import HTTPException
from app.config import get_settings
from app.utils.pdf_converter import pdf_to_base64

settings = get_settings()
client = OpenAI(api_key=settings.OPENAI_API_KEY)


COMPREHENSIVE_PROMPT = """Du är en expert på att läsa och extrahera data från svenska fakturor.

Din uppgift är att analysera fakturan noggrant och returnera ALLA relevanta uppgifter i JSON-format.

Följ dessa regler:
1. Returnera ENDAST giltig JSON (ingen annan text)
2. Använd ISO 8601-format för datum (ÅÅÅÅ-MM-DD)
3. Använd numeriska värden för belopp (INTE strängar)
4. Om ett fält inte finns på fakturan, utelämna det helt
5. Var EXTRA noggrann med:
   - Fakturanummer: Extrahera HELA numret, även om det är uppdelat
   - Organisationsnummer: Använd format XXXXXX-XXXX (med bindestreck)
   - Belopp: Numeriska värden utan valuta
   - Moms: Om fakturan visar 0% moms eller är momsfri, använd vat_amount: 0

Förväntad struktur:

{
  "invoice_number": "fakturanummer (KOMPLETT, alla siffror)",
  "invoice_date": "ÅÅÅÅ-MM-DD",
  "due_date": "ÅÅÅÅ-MM-DD",
  "issue_date": "ÅÅÅÅ-MM-DD (om skiljer sig)",
  "delivery_date": "ÅÅÅÅ-MM-DD (om angivet)",
  "booking_date": "ÅÅÅÅ-MM-DD (bokföringsdatum, om angivet)",

  "supplier": {
    "name": "Leverantörens/säljarens namn",
    "org_number": "XXXXXX-XXXX (med bindestreck)",
    "vat_number": "SEXXXXXXXXXXXX",
    "address": "Fullständig adress",
    "country": "Land (SE, NO, DK etc., om angivet)",
    "phone": "Telefon",
    "email": "E-post",
    "website": "Webbplats",
    "plusgiro": "Plusgironummer",
    "bankgiro": "Bankgironummer",
    "iban": "IBAN",
    "bic": "BIC/SWIFT"
  },

  "buyer": {
    "name": "Köparens/kundens företagsnamn",
    "contact": "Kontaktperson eller c/o",
    "address": "Fullständig adress",
    "org_number": "XXXXXX-XXXX",
    "customer_number": "Kundnummer",
    "department": "Avdelning/förvaltning/nämnd (om angivet)"
  },

  "verifikationsnummer": "Verifikationsnummer (om angivet)",

  "contract_number": "Avtalsnummer",
  "customer_number": "Kundnummer",
  "order_number": "Ordernummer",
  "reference": "Er/Vår referens",
  "interest_rate": "Dröjsmålsränta",

  "lines": [
    {
      "line_number": 1,
      "description": "Beskrivning",
      "period": "Period",
      "quantity": 1.0,
      "unit": "Enhet",
      "unit_price": 100.0,
      "amount": 100.0,
      "vat_rate": 25,
      "vat_amount": 25.0,
      "account_number": "BAS-konto (om angivet)",
      "cost_center": "Kostnadsställe (om angivet)",
      "project": "Projektkod (om angivet)",
      "object": "Objektkod (om angivet)"
    }
  ],

  "subtotal": 0.0,
  "vat_breakdown": [
    {
      "rate": 25,
      "taxable_amount": 1000.0,
      "vat_amount": 250.0
    }
  ],
  "vat_amount": 0.0,
  "total": 0.0,
  "currency": "SEK",

  "payment_method": "Plusgiro/Bankgiro",
  "ocr_number": "OCR-nummer",
  "iban": "IBAN",
  "bic": "BIC/SWIFT",
  "payment_terms": "Betalningsvillkor",
  "period": "Faktureringsperiod"
}

VIKTIGT: Extrahera ALLA fakturarader. Beräkna totaler noggrant. Var noggrann med alla siffror.
"""


async def extract_with_gpt5(full_file_path: str) -> dict:
    """
    Extract invoice data using GPT-5 with Responses API

    Args:
        full_file_path: Full path to invoice file (PDF or image)

    Returns:
        Extracted invoice data as dictionary

    Raises:
        HTTPException: If extraction fails
    """
    try:
        file_ext = Path(full_file_path).suffix.lower()

        # Convert PDF to PNG if needed
        if file_ext == '.pdf':
            base64_content = pdf_to_base64(full_file_path)
        elif file_ext in ['.png', '.jpg', '.jpeg']:
            # Load image directly
            import base64
            with open(full_file_path, "rb") as f:
                base64_content = base64.b64encode(f.read()).decode('utf-8')
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_ext}"
            )

        # Call GPT-5 Responses API
        response = client.responses.create(
            model=settings.OPENAI_MODEL,
            input=[
                {
                    "type": "message",
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": COMPREHENSIVE_PROMPT},
                        {"type": "input_image", "image_url": f"data:image/png;base64,{base64_content}"}
                    ]
                }
            ],
            reasoning={"effort": "medium"},
            text={"verbosity": "medium"}
        )

        # Extract content from response
        content = response.output_text if hasattr(response, 'output_text') else str(response)

        # Parse JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)
        return result

    except HTTPException:
        raise
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JSON from GPT-5 response: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GPT-5 extraction failed: {str(e)}"
        )
