from fastapi import APIRouter, UploadFile, File
from app.services.file_service import FileService

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    # 1. Validate file
    is_valid, error = FileService.validate_file(file)

    if not is_valid:
        return {"success": False, "error": error}

    # 2. Save file temporarily
    result = await FileService.save_temp_file(file)

    return {
        "success": True,
        "message": "File uploaded successfully",
        "data": result
    }