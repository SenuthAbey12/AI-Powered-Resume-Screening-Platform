from ollama import chat


class LLMService:
    """
    Handles communication with the local Ollama model.
    """

    MODEL_NAME = "qwen2.5:7b"

    @staticmethod
    def generate(prompt: str) -> str:
        """
        Send a prompt to the LLM and return its response.
        """

        response = chat(
            model=LLMService.MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]