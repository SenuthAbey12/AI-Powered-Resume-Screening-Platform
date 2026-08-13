from pathlib import Path

import fitz
from docx import Document


class TextExtractor:
    """Extract plain text from PDF and DOCX resume files."""

    @staticmethod
    def extract_text(file_path: str) -> str:
        path = Path(file_path)

        if not path.exists():
            raise ValueError(f"Resume file does not exist: {file_path}")

        extension = path.suffix.lower()

        if extension == ".pdf":
            text = TextExtractor._extract_pdf(file_path)
        elif extension == ".docx":
            text = TextExtractor._extract_docx(file_path)
        else:
            raise ValueError(
                "Unsupported resume file type. Only PDF and DOCX are allowed."
            )

        cleaned_text = text.strip()

        if not cleaned_text:
            raise ValueError(
                "No readable text was found in the resume. "
                "The file may be scanned or image-based."
            )

        return cleaned_text

    @staticmethod
    def _extract_pdf(file_path: str) -> str:
        text_parts: list[str] = []

        with fitz.open(file_path) as document:
            for page in document:
                page_text = page.get_text("text")

                if page_text:
                    text_parts.append(page_text)

        return "\n".join(text_parts)

    @staticmethod
    def _extract_docx(file_path: str) -> str:
        document = Document(file_path)

        paragraphs = [
            paragraph.text.strip()
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n".join(paragraphs)