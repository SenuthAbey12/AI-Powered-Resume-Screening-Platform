from typing import Any

from ollama import chat

from app.models.resume import ParsedResume


class LLMService:
    """
    Handle communication with the local Ollama model.
    """

    MODEL_NAME = "qwen2.5:1.5b"

    @staticmethod
    def generate(prompt: str) -> str:
        response: Any = chat(
            model=LLMService.MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],

            # Force the model output to follow the
            # ParsedResume JSON schema.
            format=ParsedResume.model_json_schema(),

            keep_alive="30m",

            options={
                "temperature": 0,
                "num_ctx": 4096,
                "num_predict": 800,
            },
        )

        content = response.message.content

        if not content:
            raise ValueError("The AI model returned an empty response")

        return content
