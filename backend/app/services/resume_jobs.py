import asyncio
import logging
from dataclasses import dataclass, replace
from threading import Lock
from typing import Any

from app.schemas.resume import ResumeJobResponse, ResumeJobStatus
from app.services.ai_service import (
    AIServiceClient,
    AIServiceError,
)
from app.services.file_service import FileService


logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ResumeJob:
    job_id: str
    file_id: str
    file_path: str
    filename: str
    original_filename: str
    content_type: str
    status: ResumeJobStatus = ResumeJobStatus.QUEUED
    error: str | None = None
    raw_text: str | None = None
    parsed_data: dict[str, Any] | None = None

    def to_response(self) -> ResumeJobResponse:
        return ResumeJobResponse(
            job_id=self.job_id,
            file_id=self.file_id,
            filename=self.filename,
            original_filename=self.original_filename,
            status=self.status,
            error=self.error,
            raw_text=self.raw_text,
            parsed_data=self.parsed_data,
        )


class ResumeJobStore:
    """Temporary in-process store behind a replaceable job boundary."""

    def __init__(self) -> None:
        self._jobs: dict[str, ResumeJob] = {}
        self._lock = Lock()

    def create(self, job: ResumeJob) -> ResumeJobResponse:
        with self._lock:
            self._jobs[job.job_id] = job
            return job.to_response()

    def get(self, job_id: str) -> ResumeJob | None:
        with self._lock:
            return self._jobs.get(job_id)

    def get_response(self, job_id: str) -> ResumeJobResponse | None:
        job = self.get(job_id)
        return job.to_response() if job else None

    def update(
        self,
        job_id: str,
        **changes: Any,
    ) -> ResumeJobResponse | None:
        with self._lock:
            job = self._jobs.get(job_id)

            if job is None:
                return None

            updated_job = replace(job, **changes)
            self._jobs[job_id] = updated_job
            return updated_job.to_response()

    def clear(self) -> None:
        with self._lock:
            self._jobs.clear()


resume_job_store = ResumeJobStore()
resume_processing_lock = asyncio.Lock()


async def process_resume_job(
    job_id: str,
    ai_service: AIServiceClient,
) -> None:
    # Local CPU inference is intentionally serialized. Additional jobs remain
    # queued instead of slowing every active parse through model contention.
    async with resume_processing_lock:
        job = resume_job_store.get(job_id)

        if job is None:
            return

        resume_job_store.update(
            job_id,
            status=ResumeJobStatus.PROCESSING,
            error=None,
        )

        try:
            processed_resume = await ai_service.process_resume(
                file_path=job.file_path,
                original_filename=job.original_filename,
                content_type=job.content_type,
            )
        except AIServiceError as exc:
            FileService.delete_temp_file(job.file_path)
            resume_job_store.update(
                job_id,
                status=ResumeJobStatus.FAILED,
                error=str(exc),
            )
        except Exception:
            logger.exception(
                "Unexpected resume processing failure for job %s",
                job_id,
            )
            FileService.delete_temp_file(job.file_path)
            resume_job_store.update(
                job_id,
                status=ResumeJobStatus.FAILED,
                error="Resume processing failed unexpectedly",
            )
        else:
            resume_job_store.update(
                job_id,
                status=ResumeJobStatus.COMPLETED,
                raw_text=processed_resume.raw_text,
                parsed_data=processed_resume.parsed_data,
                error=None,
            )
