import unittest
from types import SimpleNamespace
from unittest.mock import patch

from app.models.resume import ParsedResume
from app.services.llm import LLMService


class LLMServiceTests(unittest.TestCase):
    @patch("app.services.llm.chat")
    def test_generate_requests_structured_deterministic_output(
        self,
        chat,
    ) -> None:
        chat.return_value = SimpleNamespace(
            message=SimpleNamespace(content='{"full_name": "Jane Doe"}')
        )

        result = LLMService.generate("Extract this resume")

        self.assertEqual(result, '{"full_name": "Jane Doe"}')
        chat.assert_called_once()
        call_arguments = chat.call_args.kwargs
        self.assertEqual(call_arguments["model"], "qwen2.5:1.5b")
        self.assertEqual(
            call_arguments["format"],
            ParsedResume.model_json_schema(),
        )
        self.assertEqual(call_arguments["options"]["temperature"], 0)
        self.assertEqual(call_arguments["options"]["num_ctx"], 4096)
        self.assertEqual(call_arguments["options"]["num_predict"], 800)

    @patch("app.services.llm.chat")
    def test_generate_rejects_empty_model_content(self, chat) -> None:
        chat.return_value = SimpleNamespace(
            message=SimpleNamespace(content=None)
        )

        with self.assertRaisesRegex(ValueError, "empty response"):
            LLMService.generate("Extract this resume")


if __name__ == "__main__":
    unittest.main()
