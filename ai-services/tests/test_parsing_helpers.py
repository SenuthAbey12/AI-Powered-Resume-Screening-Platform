import unittest

from app.services.contact_extractor import ContactExtractor
from app.services.section_splitter import SectionSplitter


class ContactExtractorTests(unittest.TestCase):
    def test_extracts_supported_contact_fields(self) -> None:
        contacts = ContactExtractor.extract(
            "Jane Doe\n"
            "jane@example.com\n"
            "Mobile: +94 77 123 4567\n"
            "https://linkedin.com/in/jane-doe"
        )

        self.assertEqual(contacts["email"], "jane@example.com")
        self.assertEqual(contacts["phone"], "+94 77 123 4567")
        self.assertEqual(
            contacts["linkedin"],
            "https://linkedin.com/in/jane-doe",
        )

    def test_year_range_is_not_treated_as_phone(self) -> None:
        contacts = ContactExtractor.extract(
            "Software Engineer\n2018 - 2022\nexample@example.com"
        )

        self.assertEqual(contacts["phone"], "")


class SectionSplitterTests(unittest.TestCase):
    def test_splits_known_sections_and_preserves_header(self) -> None:
        sections = SectionSplitter.split(
            "Jane Doe\n"
            "SUMMARY:\nBackend engineer\n"
            "TECHNICAL SKILLS\nPython, FastAPI\n"
            "WORK EXPERIENCE\nEngineer at Example Ltd"
        )

        self.assertEqual(sections["header"], "Jane Doe")
        self.assertEqual(sections["profile"], "Backend engineer")
        self.assertEqual(sections["skills"], "Python, FastAPI")
        self.assertEqual(
            sections["experience"],
            "Engineer at Example Ltd",
        )


if __name__ == "__main__":
    unittest.main()
