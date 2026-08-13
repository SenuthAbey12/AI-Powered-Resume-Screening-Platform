from pathlib import Path

import httpx
from pydantic import ValidationError

from app.core.config import get_settings
from app.schemas.resume import AIResumeProcessResponse


class AIServiceError(Exception):
    """Base error raised when resume processing cannot complete."""


class AIServiceUnavailableError(AIServiceError):
    """Raised when the backend cannot reach the AI service."""


class AIServiceResponseError(AIServiceError):
    """Raised when the AI service rejects a request or response contract."""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


class AIServiceClient:
    def __init__(
        self,
        base_url: str,
        timeout_seconds: float,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = httpx.Timeout(timeout_seconds)
        self.transport = transport

    async def process_resume(
        self,
        file_path: str,
        original_filename: str,
        content_type: str,
    ) -> AIResumeProcessResponse:
        path = Path(file_path)

        try:
            with path.open("rb") as resume_file:
                files = {
                    "file": (
                        original_filename,
                        resume_file,
                        content_type,
                    )
                }

                async with httpx.AsyncClient(
                    base_url=self.base_url,
                    timeout=self.timeout,
                    transport=self.transport,
                ) as client:
                    response = await client.post(
                        "/resume/process",
                        files=files,
                    )
        except httpx.TimeoutException as exc:
            raise AIServiceUnavailableError(
                "The AI service timed out while processing the resume"
            ) from exc
        except httpx.RequestError as exc:
            raise AIServiceUnavailableError(
                "The AI service is unavailable"
            ) from exc
        except OSError as exc:
            raise AIServiceResponseError(
                "The stored resume could not be opened for processing"
            ) from exc

        if response.is_error:
            raise AIServiceResponseError(
                self._extract_error_detail(response),
                status_code=response.status_code,
            )

        try:
            return AIResumeProcessResponse.model_validate(response.json())
        except (ValueError, ValidationError) as exc:
            raise AIServiceResponseError(
                "The AI service returned an invalid response"
            ) from exc

    @staticmethod
    def _extract_error_detail(response: httpx.Response) -> str:
        try:
            response_data = response.json()
        except ValueError:
            return "The AI service could not process the resume"

        if isinstance(response_data, dict):
            detail = response_data.get("detail")

            if isinstance(detail, str) and detail:
                return detail

        return "The AI service could not process the resume"


def get_ai_service_client() -> AIServiceClient:
    settings = get_settings()
    return AIServiceClient(
        base_url=settings.ai_service_url,
        timeout_seconds=settings.ai_service_timeout_seconds,
    )
