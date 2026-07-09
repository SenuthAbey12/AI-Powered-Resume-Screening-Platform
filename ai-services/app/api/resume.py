from fastapi import APIRouter
from pydantic import BaseModel

from app.services.extractor import TextExtractor

router = APIRouter()


class ExtractRequest(BaseModel):
    file_path: str


@router.post("/extract-text")
def extract_text(request: ExtractRequest):

    text = TextExtractor.extract_text(request.file_path)

    return {
        "success": True,
        "text": text
    }