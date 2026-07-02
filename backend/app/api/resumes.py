from fastapi import APIRouter

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


@router.get("/")
def resumes():
    return {
        "message": "Resume API working"
    }