import re
from typing import Optional


class ContactExtractor:

    EMAIL_PATTERN = re.compile(
        r"\b[A-Za-z0-9._%+-]+"
        r"@[A-Za-z0-9.-]+"
        r"\.[A-Za-z]{2,}\b"
    )

    PHONE_PATTERN = re.compile(
        r"(?<!\w)"
        r"(?:\+?\d[\d\s().-]{7,}\d)"
        r"(?!\w)"
    )

    URL_PATTERN = re.compile(
        r"(?:https?://|www\.)"
        r"[^\s<>()\[\]{}]+",
        re.IGNORECASE,
    )

    @staticmethod
    def _unique(values: list[str]) -> list[str]:
        result = []
        seen = set()

        for value in values:
            cleaned = value.strip().rstrip(".,;:)")

            key = cleaned.lower()

            if cleaned and key not in seen:
                seen.add(key)
                result.append(cleaned)

        return result

    @staticmethod
    def _normalize_phone(phone: str) -> Optional[str]:

        phone = phone.strip()

        has_plus = phone.startswith("+")

        digits = re.sub(r"\D", "", phone)

        # Avoid dates / random small numbers.
        if len(digits) < 8 or len(digits) > 15:
            return None

        if has_plus:
            return "+" + digits

        return digits

    @classmethod
    def extract(cls, text: str) -> dict:

        emails = cls._unique(
            cls.EMAIL_PATTERN.findall(text)
        )

        raw_phones = cls.PHONE_PATTERN.findall(text)

        phones = []

        for phone in raw_phones:
            normalized = cls._normalize_phone(phone)

            if normalized and normalized not in phones:
                phones.append(normalized)

        urls = cls._unique(
            cls.URL_PATTERN.findall(text)
        )

        linkedin = None
        github = None
        portfolio = None
        other_urls = []

        for url in urls:

            lowered = url.lower()

            if "linkedin.com/" in lowered:
                linkedin = linkedin or url

            elif "github.com/" in lowered:
                github = github or url

            elif portfolio is None:
                portfolio = url

            else:
                other_urls.append(url)

        return {
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
            "linkedin": linkedin,
            "github": github,
            "portfolio": portfolio,
            "other_urls": other_urls,
        }