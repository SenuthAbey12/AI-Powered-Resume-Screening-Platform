import unittest

from pydantic import ValidationError

from app.models.resume import ParsedResume


class ParsedResumeTests(unittest.TestCase):
    def test_defaults_produce_complete_contract(self) -> None:
        result = ParsedResume().model_dump()

        self.assertEqual(result["full_name"], "")
        self.assertEqual(result["skills"], [])
        self.assertEqual(result["experience"], [])
        self.assertIn("achievements", result)

    def test_string_lists_are_cleaned_and_deduplicated(self) -> None:
        resume = ParsedResume.model_validate(
            {
                "skills": [" Python ", "python", "FastAPI", ""],
                "education": "BSc Computer Science",
            }
        )

        self.assertEqual(resume.skills, ["Python", "FastAPI"])
        self.assertEqual(
            resume.education,
            ["BSc Computer Science"],
        )

    def test_experience_aliases_are_normalized(self) -> None:
        resume = ParsedResume.model_validate(
            {
                "experience": [
                    {
                        "job_title": " Engineer ",
                        "company": " Example Ltd ",
                        "dates": "2022 - Present",
                        "description": " APIs ",
                    }
                ]
            }
        )

        experience = resume.experience[0]
        self.assertEqual(experience.title, "Engineer")
        self.assertEqual(experience.company, "Example Ltd")
        self.assertEqual(experience.period, "2022 - Present")
        self.assertEqual(experience.description, "APIs")

    def test_non_string_list_items_are_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            ParsedResume.model_validate({"skills": ["Python", 42]})


if __name__ == "__main__":
    unittest.main()
