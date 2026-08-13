import re


class ContactExtractor:
    EMAIL_PATTERN = re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    )

    PHONE_PATTERN = re.compile(
        r"(?<!\d)(?:\+?\d[\d\s().-]{7,}\d)(?!\d)"
    )

    LINKEDIN_PATTERN = re.compile(
        r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+",
        re.IGNORECASE,
    )

    @classmethod
    def extract(cls, text: str) -> dict[str, str]:
        email_match = cls.EMAIL_PATTERN.search(text)
        linkedin_match = cls.LINKEDIN_PATTERN.search(text)
        phone = cls._find_phone(text)

        return {
            "email": (
                email_match.group(0).strip()
                if email_match
                else ""
            ),
            "phone": phone,
            "linkedin": (
                linkedin_match.group(0).strip()
                if linkedin_match
                else ""
            ),
        }

    @classmethod
    def _find_phone(cls, text: str) -> str:
        for line in text.splitlines():
            for phone_match in cls.PHONE_PATTERN.finditer(line):
                phone = cls._clean_phone(phone_match.group(0))

                if cls._is_likely_phone(phone, line):
                    return phone

        return ""

    @staticmethod
    def _is_likely_phone(phone: str, source_line: str) -> bool:
        digits = re.sub(r"\D", "", phone)

        if not 8 <= len(digits) <= 15:
            return False

        # Do not treat common employment/education year ranges as phones.
        if re.fullmatch(r"\d{4}\s*[-\u2013\u2014]\s*\d{4}", phone):
            return False

        has_phone_label = bool(
            re.search(
                r"\b(?:phone|mobile|tel|telephone|contact)\b",
                source_line,
                re.IGNORECASE,
            )
        )

        return len(digits) >= 9 or phone.startswith("+") or has_phone_label

    @staticmethod
    def _clean_phone(phone: str) -> str:
        return re.sub(r"\s+", " ", phone).strip()
