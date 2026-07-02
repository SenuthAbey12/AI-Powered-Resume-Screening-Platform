from fastapi import FastAPI
from app.database.connection import engine
from app.database.models import Base
from app.api import auth,jobs,resumes,users
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Screening API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    auth.router
)

app.include_router(
    users.router
)

app.include_router(
    jobs.router
)

app.include_router(
    resumes.router
)


@app.get("/")
def root():

    return {
        "message":
        "AI Resume Screening Backend Running"
    }