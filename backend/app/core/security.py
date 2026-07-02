from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY="secret"
ALGORITHM="HS256"


pwd_content = CryptContext(
    schemes = ["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):

    # bcrypt supports max 72 bytes
    password = password.encode("utf-8")[:72].decode("utf-8")

    return pwd_content.hash(password)



def verify_password(
    plain_password,
    hashed_password
):

    plain_password = (
        plain_password.encode("utf-8")[:72]
        .decode("utf-8")
    )

    return pwd_content.verify(
        plain_password,
        hashed_password
    )

def create_access_token(data:dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=60)

    payload["exp"] = expire

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
