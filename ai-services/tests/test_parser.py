import json
import unittest
from unittest.mock import patch

from app.services.hybrid_parser import HybridResumeParser
from app.services.parser import ResumeParser


class ResumeParserTests(unittest.TestCase):
    RESUME_TEXT = """
Jane Doe
jane@example.com
Phone: +94 77 123 4567
linkedin.com/in/jane-doe

PROFILE
Backend engineer focused on reliable APIs.

SKILLS
Python, FastAPI
"""

    def test_parse_builds_prompt_and_returns_validated_data(self) -> None:
        captured_prompt = ""

        def generate(prompt: str) -> str:
            nonlocal captured_prompt
            captured_prompt = prompt
            model_data = {
                "full_name": "Jane Doe",
                "email": "incorrect@example.com",
                "phone": "",
                "linkedin": "",
                "summary": "",
                "skills": [" Python ", "python", "FastAPI"],
                "education": [],
                "experience": [
                    {
                        "job_title": "Software Engineer",
                        "company": "Example Ltd",
                        "dates": "2022 - Present",
                        "description": "Built APIs",
                    }
                ],
                "projects": [],
                "certifications": [],
                "achievements": [],
            }
            return f"```json\n{json.dumps(model_data)}\n```"

        result = ResumeParser.parse(
            self.RESUME_TEXT,
            generator=generate,
        )

        self.assertNotIn("{{TEXT}}", captured_prompt)
        self.assertIn("KNOWN CONTACT DETAILS:", captured_prompt)
        self.assertEqual(result["email"], "jane@example.com")
        self.assertEqual(result["phone"], "+94 77 123 4567")
        self.assertEqual(
            result["linkedin"],
            "linkedin.com/in/jane-doe",
        )
        self.assertEqual(
            result["summary"],
            "Backend engineer focused on reliable APIs.",
        )
        self.assertEqual(result["skills"], ["Python", "FastAPI"])
        self.assertEqual(
            result["experience"][0]["title"],
            "Software Engineer",
        )

    def test_empty_resume_is_rejected_before_generation(self) -> None:
        generator_called = False

        def generate(_: str) -> str:
            nonlocal generator_called
            generator_called = True
            return "{}"

        with self.assertRaisesRegex(ValueError, "Resume text is empty"):
            ResumeParser.parse("   ", generator=generate)

        self.assertFalse(generator_called)

    def test_invalid_json_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "invalid JSON"):
            ResumeParser.parse(
                "Jane Doe",
                generator=lambda _: '{"full_name": "Jane Doe"',
            )

    def test_invalid_resume_shape_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "required schema"):
            ResumeParser.parse(
                "Jane Doe",
                generator=lambda _: '{"experience": ["invalid"]}',
            )

    def test_prompt_requires_one_placeholder(self) -> None:
        with self.assertRaisesRegex(RuntimeError, "exactly one"):
            ResumeParser._build_prompt(
                prompt_template="Prompt without a placeholder",
                resume_text="Jane Doe",
            )

    def test_hybrid_parser_delegates_to_production_parser(self) -> None:
        expected = {"full_name": "Jane Doe"}

        with patch.object(
            ResumeParser,
            "parse",
            return_value=expected,
        ) as parse:
            result = HybridResumeParser.parse("Jane Doe")

        self.assertEqual(result, expected)
        parse.assert_called_once_with("Jane Doe")


if __name__ == "__main__":
    unittest.main()
