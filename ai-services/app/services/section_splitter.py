import re


class SectionSplitter:
    SECTION_ALIASES = {
        "profile": {
            "PROFILE",
            "SUMMARY",
            "PROFESSIONAL SUMMARY",
            "ABOUT ME",
            "OBJECTIVE",
        },
        "skills": {
            "SKILLS",
            "TECHNICAL SKILLS",
            "CORE SKILLS",
            "COMPETENCIES",
        },
        "experience": {
            "EXPERIENCE",
            "WORK EXPERIENCE",
            "EMPLOYMENT HISTORY",
            "PROFESSIONAL EXPERIENCE",
        },
        "education": {
            "EDUCATION",
            "ACADEMIC BACKGROUND",
            "QUALIFICATIONS",
        },
        "certifications": {
            "CERTIFICATIONS",
            "CERTIFICATES",
            "PROFESSIONAL QUALIFICATIONS",
            "TRAINING",
        },
        "projects": {
            "PROJECTS",
            "ACADEMIC PROJECTS",
            "PERSONAL PROJECTS",
        },
        "achievements": {
            "ACHIEVEMENTS",
            "AWARDS",
            "HONORS",
        },
    }

    @classmethod
    def split(cls, text: str) -> dict[str, str]:
        normalized_lookup = {
            alias.upper(): canonical_name
            for canonical_name, aliases in cls.SECTION_ALIASES.items()
            for alias in aliases
        }

        sections: dict[str, list[str]] = {
            "header": []
        }

        current_section = "header"

        for raw_line in text.splitlines():
            line = raw_line.strip()

            if not line:
                continue

            heading = cls._normalize_heading(line)

            if heading in normalized_lookup:
                current_section = normalized_lookup[heading]
                sections.setdefault(current_section, [])
                continue

            sections.setdefault(current_section, []).append(line)

        return {
            section_name: "\n".join(lines).strip()
            for section_name, lines in sections.items()
        }

    @staticmethod
    def _normalize_heading(line: str) -> str:
        cleaned = re.sub(r"[^A-Za-z ]", "", line)
        return re.sub(r"\s+", " ", cleaned).strip().upper()