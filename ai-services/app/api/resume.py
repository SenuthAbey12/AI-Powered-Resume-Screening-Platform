from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
)
from pathlib import Path
import tempfile

from pydantic import BaseModel

from app.services.extractor import (
    TextExtractor,
)

from app.services.hybrid_parser import (
    HybridResumeParser,
)


router = APIRouter()


@router.post("/process")
async def process_resume(file: UploadFile = File(...)) -> dict:
    suffix = Path(file.filename or "resume.pdf").suffix.lower()

    if suffix not in {".pdf", ".docx"}:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed",
        )

    temporary_path: str | None = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
            temporary_file.write(await file.read())
            temporary_path = temporary_file.name

        parsed = HybridResumeParser.parse_file(
            file_path=temporary_path,
            include_debug=True,
        )

        return {
            "success": True,
            "filename": file.filename or Path(temporary_path).name,
            "raw_text": parsed["debug"]["raw_text"],
            "parsed_data": parsed["data"],
        }
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {exc}",
        ) from exc
    finally:
        if temporary_path:
            Path(temporary_path).unlink(missing_ok=True)


class ExtractRequest(BaseModel):
    file_path: str


class ParseRequest(BaseModel):
    file_path: str
    include_debug: bool = False


# =========================================================
# TEXT EXTRACTION
# =========================================================

@router.post(
    "/extract-text"
)
def extract_text(
    request: ExtractRequest
):

    try:

        text = (
            TextExtractor
            .extract_text(
                request.file_path
            )
        )

        return {
            "success": True,
            "text": text,
        }

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


# =========================================================
# FULL RESUME PARSING
# =========================================================

@router.post(
    "/parse"
)
def parse_resume(
    request: ParseRequest
):

    try:

        return (
            HybridResumeParser
            .parse_file(
                file_path=(
                    request.file_path
                ),
                include_debug=(
                    request.include_debug
                ),
            )
        )

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Resume parsing failed: "
                f"{str(exc)}"
            ),
        ) from exc