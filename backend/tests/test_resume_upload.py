import unittest
from io import BytesIO
from unittest.mock import AsyncMock, patch

from fastapi import BackgroundTasks, HTTPException, UploadFile
from starlette.datastructures import Headers

from app.api.resumes import get_resume_job_status, upload_resume
from app.schemas.resume import AIResumeProcessResponse, ResumeJobStatus
from app.services.ai_service import AIServiceUnavailableError
from app.services.file_service import FileService
from app.services.resume_jobs import resume_job_store


class SuccessfulAIService:
    async def process_resume(
        self,
        file_path: str,
        original_filename: str,
        content_type: str,
    ) -> AIResumeProcessResponse:
        return AIResumeProcessResponse(
            success=True,
            filename=original_filename,
            raw_text="Jane Doe",
            parsed_data={"full_name": "Jane Doe"},
        )


class UnavailableAIService:
    async def process_resume(
        self,
        file_path: str,
        original_filename: str,
        content_type: str,
    ) -> AIResumeProcessResponse:
        raise AIServiceUnavailableError("The AI service is unavailable")


def make_upload(content_type: str = "application/pdf") -> UploadFile:
    return UploadFile(
        file=BytesIO(b"test resume"),
        filename="resume.pdf",
        headers=Headers({"content-type": content_type}),
    )


class ResumeUploadTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        resume_job_store.clear()

    @patch.object(
        FileService,
        "save_temp_file",
        new_callable=AsyncMock,
    )
    async def test_upload_returns_queued_job_immediately(
        self,
        save_file,
    ) -> None:
        save_file.return_value = {
            "file_id": "file-id",
            "file_path": "uploads/file-id.pdf",
            "filename": "file-id.pdf",
        }
        background_tasks = BackgroundTasks()

        result = await upload_resume(
            background_tasks=background_tasks,
            file=make_upload(),
            ai_service=SuccessfulAIService(),
        )

        self.assertTrue(result["success"])
        self.assertEqual(result["data"]["job_id"], "file-id")
        self.assertEqual(result["data"]["status"], "queued")
        self.assertEqual(len(background_tasks.tasks), 1)

    @patch.object(
        FileService,
        "save_temp_file",
        new_callable=AsyncMock,
    )
    async def test_background_job_exposes_completed_result(
        self,
        save_file,
    ) -> None:
        save_file.return_value = {
            "file_id": "file-id",
            "file_path": "uploads/file-id.pdf",
            "filename": "file-id.pdf",
        }
        background_tasks = BackgroundTasks()

        await upload_resume(
            background_tasks=background_tasks,
            file=make_upload(),
            ai_service=SuccessfulAIService(),
        )
        await background_tasks()

        job = get_resume_job_status("file-id")
        self.assertEqual(job.status, ResumeJobStatus.COMPLETED)
        self.assertEqual(job.raw_text, "Jane Doe")
        self.assertEqual(job.parsed_data["full_name"], "Jane Doe")

    @patch.object(FileService, "delete_temp_file")
    @patch.object(
        FileService,
        "save_temp_file",
        new_callable=AsyncMock,
    )
    async def test_background_failure_is_visible_and_removes_file(
        self,
        save_file,
        delete_file,
    ) -> None:
        save_file.return_value = {
            "file_id": "file-id",
            "file_path": "uploads/file-id.pdf",
            "filename": "file-id.pdf",
        }
        background_tasks = BackgroundTasks()

        await upload_resume(
            background_tasks=background_tasks,
            file=make_upload(),
            ai_service=UnavailableAIService(),
        )
        await background_tasks()

        job = get_resume_job_status("file-id")
        self.assertEqual(job.status, ResumeJobStatus.FAILED)
        self.assertEqual(job.error, "The AI service is unavailable")
        delete_file.assert_called_once_with("uploads/file-id.pdf")

    async def test_invalid_file_type_returns_http_400(self) -> None:
        with self.assertRaises(HTTPException) as context:
            await upload_resume(
                background_tasks=BackgroundTasks(),
                file=make_upload("text/plain"),
                ai_service=SuccessfulAIService(),
            )

        self.assertEqual(context.exception.status_code, 400)

    def test_missing_job_returns_http_404(self) -> None:
        with self.assertRaises(HTTPException) as context:
            get_resume_job_status("missing")

        self.assertEqual(context.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()
