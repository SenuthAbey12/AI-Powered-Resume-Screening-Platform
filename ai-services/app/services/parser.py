import json
from collections.abc import Callable
from typing import Any

from pydantic import ValidationError

from app.models.resume import ParsedResume
from app.services.contact_extractor import ContactExtractor
from app.services.llm import LLMService
from app.services.prompt_loader import load_resume_prompt
from app.services.section_splitter import SectionSplitter


LLMGenerator = Callable[[str], str]


class ResumeParser:
    """Convert extracted resume text into validated resume data."""

    @classmethod
    def parse(
        cls,
        text: str,
        generator: LLMGenerator | None = None,
    ) -> dict[str, Any]:
        cleaned_text = text.strip()

        if not cleaned_text:
            raise ValueError("Resume text is empty")

        contacts = ContactExtractor.extract(cleaned_text)
        sections = SectionSplitter.split(cleaned_text)
        compact_resume = cls._build_compact_resume(
            sections=sections,
            contacts=contacts,
        )

        prompt_template = load_resume_prompt()
        full_prompt = cls._build_prompt(
            prompt_template=prompt_template,
            resume_text=compact_resume,
        )

        generate = generator or LLMService.generate
        model_response = generate(full_prompt)
        parsed_data = cls._extract_json(model_response)

        try:
            parsed_resume = ParsedResume.model_validate(parsed_data)
        except ValidationError as exc:
            raise ValueError(
                "The AI model returned resume data that does not match "
                f"the required schema: {exc}"
            ) from exc

        result = parsed_resume.model_dump()

        # Rule-based contact values are copied directly from the source text
        # and therefore take precedence over generated values.
        for field_name in ("email", "phone", "linkedin"):
            if contacts[field_name]:
                result[field_name] = contacts[field_name]

        if not result["summary"] and sections.get("profile"):
            result["summary"] = sections["profile"]

        return result

    @staticmethod
    def _build_prompt(
        prompt_template: str,
        resume_text: str,
    ) -> str:
        placeholder = "{{TEXT}}"

        if prompt_template.count(placeholder) != 1:
            raise RuntimeError(
                "Resume prompt must contain exactly one {{TEXT}} placeholder"
            )

        return prompt_template.replace(placeholder, resume_text)

    @staticmethod
    def _build_compact_resume(
        sections: dict[str, str],
        contacts: dict[str, str],
    ) -> str:
        section_labels = (
            ("HEADER", "header"),
            ("PROFILE", "profile"),
            ("SKILLS", "skills"),
            ("EMPLOYMENT", "experience"),
            ("EDUCATION", "education"),
            ("CERTIFICATIONS", "certifications"),
            ("PROJECTS", "projects"),
            ("ACHIEVEMENTS", "achievements"),
        )

        compact_parts = [
            "KNOWN CONTACT DETAILS:",
            f'Email: {contacts["email"]}',
            f'Phone: {contacts["phone"]}',
            f'LinkedIn: {contacts["linkedin"]}',
        ]

        for label, section_name in section_labels:
            section_text = sections.get(section_name, "")

            if section_text:
                compact_parts.extend(("", f"{label}:", section_text))

        return "\n".join(compact_parts).strip()

    @staticmethod
    def _extract_json(response: str) -> dict[str, Any]:
        """
        Extract the first JSON object from the model response.

        This also handles responses where the model accidentally adds
        text or Markdown around the JSON.
        """
        cleaned_response = response.strip()

        if not cleaned_response:
            raise ValueError(
                "The AI model returned an empty response"
            )

        try:
            parsed_data = json.loads(cleaned_response)
        except json.JSONDecodeError:
            object_start = cleaned_response.find("{")

            if object_start == -1:
                raise ValueError(
                    "The AI model response did not contain a JSON object"
                )

            try:
                parsed_data, _ = json.JSONDecoder().raw_decode(
                    cleaned_response[object_start:]
                )
            except json.JSONDecodeError as exc:
                raise ValueError(
                    f"The AI model returned invalid JSON: {exc.msg}"
                ) from exc

        if not isinstance(parsed_data, dict):
            raise ValueError(
                "The AI model response must be a JSON object"
            )

        return parsed_data
