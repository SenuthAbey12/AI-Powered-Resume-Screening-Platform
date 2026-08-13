from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.services.ai_service import (
    AIServiceClient,
    get_ai_service_client,
)
from app.services.file_service import FileService
from app.schemas.resume import ResumeJobResponse
from app.services.resume_jobs import (
    ResumeJob,
    process_resume_job,
    resume_job_store,
)

router = APIRouter()


@router.post(
    "/upload-resume",
    status_code=status.HTTP_202_ACCEPTED,
)
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    ai_service: AIServiceClient = Depends(get_ai_service_client),
) -> dict[str, object]:

    # 1. Validate file
    is_valid, error = FileService.validate_file(file)

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=error,
        )

    # 2. Save file temporarily
    result = await FileService.save_temp_file(file)

    job = ResumeJob(
        job_id=result["file_id"],
        file_id=result["file_id"],
        file_path=result["file_path"],
        filename=result["filename"],
        original_filename=file.filename or result["filename"],
        content_type=file.content_type or "application/octet-stream",
    )
    queued_job = resume_job_store.create(job)

    background_tasks.add_task(
        process_resume_job,
        job.job_id,
        ai_service,
    )

    return {
        "success": True,
        "message": "Resume uploaded and queued for AI processing",
        "data": queued_job.model_dump(mode="json"),
    }


@router.get(
    "/resumes/{job_id}/status",
    response_model=ResumeJobResponse,
)
def get_resume_job_status(job_id: str) -> ResumeJobResponse:
    job = resume_job_store.get_response(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Resume processing job was not found",
        )

    return job
