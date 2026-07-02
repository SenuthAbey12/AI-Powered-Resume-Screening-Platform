from pydantic import BaseModel, EmailStr ,ConfigDict



class UserCreate(BaseModel):

    name: str

    email: EmailStr

    password: str

    company_name: str



class UserResponse(BaseModel):

    id:int
    name:str
    email:EmailStr
    role:str
    company_id:int


    model_config = ConfigDict(
        from_attributes=True
    )