from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.database.connection import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse
)

from app.schemas.auth import (
    TokenResponse,
    LoginRequest
)

from app.services.auth_service import (
    authenticate_user,
    register_user
)



router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user:UserCreate,
    db:Session=Depends(get_db)
):

    new_user = register_user(
        db,
        user.name,
        user.email,
        user.password,
        user.company_name
    )

    return new_user


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user:LoginRequest,
    db:Session=Depends(get_db)
):


    token = authenticate_user(
        db,
        user.email,
        user.password
    )


    if not token:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    return {
        "access_token":token,
        "token_type":"bearer"
    }