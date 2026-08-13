import tempfile
import unittest
from pathlib import Path

import httpx

from app.services.ai_service import (
    AIServiceClient,
    AIServiceResponseError,
    AIServiceUnavailableError,
)


class AIServiceClientTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        temporary_file = tempfile.NamedTemporaryFile(
            suffix=".pdf",
            delete=False,
        )
        temporary_file.write(b"test resume")
        temporary_file.close()
        self.file_path = Path(temporary_file.name)

    def tearDown(self) -> None:
        self.file_path.unlink(missing_ok=True)

    async def test_process_resume_returns_validated_response(self) -> None:
        async def handler(request: httpx.Request) -> httpx.Response:
            self.assertEqual(request.url.path, "/resume/process")
            self.assertIn(
                "multipart/form-data",
                request.headers["content-type"],
            )
            return httpx.Response(
                200,
                json={
                    "success": True,
                    "filename": "resume.pdf",
                    "raw_text": "Jane Doe",
                    "parsed_data": {"full_name": "Jane Doe"},
                },
            )

        client = AIServiceClient(
            base_url="http://ai-service.test",
            timeout_seconds=5,
            transport=httpx.MockTransport(handler),
        )

        result = await client.process_resume(
            file_path=str(self.file_path),
            original_filename="resume.pdf",
            content_type="application/pdf",
        )

        self.assertTrue(result.success)
        self.assertEqual(result.raw_text, "Jane Doe")
        self.assertEqual(
            result.parsed_data["full_name"],
            "Jane Doe",
        )

    async def test_downstream_validation_error_is_preserved(self) -> None:
        async def handler(_: httpx.Request) -> httpx.Response:
            return httpx.Response(
                422,
                json={"detail": "No readable text was found"},
            )

        client = AIServiceClient(
            base_url="http://ai-service.test",
            timeout_seconds=5,
            transport=httpx.MockTransport(handler),
        )

        with self.assertRaises(AIServiceResponseError) as context:
            await client.process_resume(
                file_path=str(self.file_path),
                original_filename="resume.pdf",
                content_type="application/pdf",
            )

        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(
            str(context.exception),
            "No readable text was found",
        )

    async def test_connection_failure_is_reported_as_unavailable(self) -> None:
        async def handler(request: httpx.Request) -> httpx.Response:
            raise httpx.ConnectError(
                "connection failed",
                request=request,
            )

        client = AIServiceClient(
            base_url="http://ai-service.test",
            timeout_seconds=5,
            transport=httpx.MockTransport(handler),
        )

        with self.assertRaises(AIServiceUnavailableError):
            await client.process_resume(
                file_path=str(self.file_path),
                original_filename="resume.pdf",
                content_type="application/pdf",
            )

    async def test_invalid_downstream_contract_is_rejected(self) -> None:
        async def handler(_: httpx.Request) -> httpx.Response:
            return httpx.Response(200, json={"success": True})

        client = AIServiceClient(
            base_url="http://ai-service.test",
            timeout_seconds=5,
            transport=httpx.MockTransport(handler),
        )

        with self.assertRaisesRegex(
            AIServiceResponseError,
            "invalid response",
        ):
            await client.process_resume(
                file_path=str(self.file_path),
                original_filename="resume.pdf",
                content_type="application/pdf",
            )


if __name__ == "__main__":
    unittest.main()
