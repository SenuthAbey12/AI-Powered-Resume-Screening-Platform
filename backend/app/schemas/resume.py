from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict


class AIResumeProcessResponse(BaseModel):
    """Response contract exposed by the standalone AI service."""

    model_config = ConfigDict(extra="ignore")

    success: bool
    filename: str
    raw_text: str
    parsed_data: dict[str, Any]


class ResumeJobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ResumeJobResponse(BaseModel):
    job_id: str
    file_id: str
    filename: str
    original_filename: str
    status: ResumeJobStatus
    error: str | None = None
    raw_text: str | None = None
    parsed_data: dict[str, Any] | None = None
