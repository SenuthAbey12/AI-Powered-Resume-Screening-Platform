import os
import tempfile
from pathlib import Path
from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from app.services.extractor import TextExtractor
from app.services.parser import ResumeParser

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/process")
async def process_resume(
    file: UploadFile = File(...),
) -> dict[str, Any]:
    """
    Upload, extract and parse one resume.

    Final route:
        POST /resume/process
    """

    original_filename = file.filename or "resume"
    extension = Path(original_filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX resume files are allowed",
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded resume file is empty",
        )

    if len(file_content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Resume file must be 10 MB or smaller",
        )

    temporary_file_path: str | None = None

    try:
        # Create a temporary file because the existing TextExtractor
        # currently works with file paths.
        with tempfile.NamedTemporaryFile(
            mode="wb",
            suffix=extension,
            delete=False,
        ) as temporary_file:
            temporary_file.write(file_content)
            temporary_file_path = temporary_file.name

        raw_text = await run_in_threadpool(
            TextExtractor.extract_text,
            temporary_file_path,
        )

        # Ollama's Python client is synchronous. Run it outside the event loop
        # so health and status requests stay responsive during CPU inference.
        parsed_data = await run_in_threadpool(
            ResumeParser.parse,
            raw_text,
        )

        return {
            "success": True,
            "filename": original_filename,
            "raw_text": raw_text,
            "parsed_data": parsed_data,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {str(exc)}",
        ) from exc

    finally:
        await file.close()

        if (
            temporary_file_path
            and os.path.exists(temporary_file_path)
        ):
            os.remove(temporary_file_path)
