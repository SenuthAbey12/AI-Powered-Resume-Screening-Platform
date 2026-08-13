from typing import Any

from app.services.parser import ResumeParser


class HybridResumeParser:
    """Compatibility wrapper for the consolidated resume parser."""

    @staticmethod
    def parse(text: str) -> dict[str, Any]:
        return ResumeParser.parse(text)
