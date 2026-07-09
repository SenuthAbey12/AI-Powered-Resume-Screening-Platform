import fitz
from docx import Document
from pathlib import Path


class TextExtractor:

    @staticmethod
    def extract_text(file_path: str) -> str:

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            return TextExtractor._extract_pdf(file_path)

        elif extension == ".docx":
            return TextExtractor._extract_docx(file_path)

        raise ValueError("Unsupported file type")


    @staticmethod
    def _extract_pdf(file_path: str) -> str:

        document = fitz.open(file_path)

        text = ""

        for page in document:
            text += page.get_text()

        document.close()

        return text


    @staticmethod
    def _extract_docx(file_path: str) -> str:

        document = Document(file_path)

        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

        return text