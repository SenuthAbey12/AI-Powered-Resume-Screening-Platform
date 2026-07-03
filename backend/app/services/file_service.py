import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads"

ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]


class FileService:

    @staticmethod
    def validate_file(file: UploadFile):
        if file.content_type not in ALLOWED_TYPES:
            return False, "Only PDF and DOCX files are allowed"
        return True, None


    @staticmethod
    async def save_temp_file(file: UploadFile):
        # generate unique ID
        file_id = str(uuid.uuid4())

        extension = file.filename.split(".")[-1]
        filename = f"{file_id}.{extension}"

        file_path = os.path.join(UPLOAD_DIR, filename)

        # save file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        return {
            "file_id": file_id,
            "file_path": file_path,
            "filename": filename
        }