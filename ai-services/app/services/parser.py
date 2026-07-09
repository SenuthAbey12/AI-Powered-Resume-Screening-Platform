import json

from llm import LLMService
from prompt_loader import load_resume_prompt


class ResumeParser:

    @staticmethod
    def parse(text: str) -> dict:

        prompt_template = load_resume_prompt()

        full_prompt = f"""
{prompt_template}

RESUME TEXT:

{text}
"""

        response = LLMService.generate(full_prompt)

        return ResumeParser._extract_json(response)

    @staticmethod
    def _extract_json(response: str) -> dict:

        try:
            start = response.find("{")
            end = response.rfind("}") + 1

            json_string = response[start:end]

            return json.loads(json_string)

        except Exception as e:

            raise ValueError(
                f"Failed to parse model response: {str(e)}"
            )