from fastapi import APIRouter

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get("/")
def jobs():
    return {
        "message": "Jobs API working"
    }