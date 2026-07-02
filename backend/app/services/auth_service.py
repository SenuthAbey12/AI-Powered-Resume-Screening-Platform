from sqlalchemy.orm import Session

from app.database.models import User, Company
from app.core.security import hash_password , verify_password , create_access_token


def register_user(
    db: Session,
    name,
    email,
    password,
    company_name
):

    # check company
    company = (
        db.query(Company)
        .filter(Company.name == company_name)
        .first()
    )

    # create company if missing
    if not company:
        company = Company(
            name=company_name
        )

        db.add(company)
        db.commit()
        db.refresh(company)


    hashed = hash_password(password)


    user = User(
        name=name,
        email=email,
        password_hash=hashed,
        role="owner",
        company_id=company.id
    )


    db.add(user)
    db.commit()
    db.refresh(user)


    return user



def authenticate_user(
    db:Session,
    email,
    password
):

    user = db.query(User)\
        .filter(User.email==email)\
        .first()


    if not user:
        return None


    if not verify_password(
        password,
        user.password_hash
    ):
        return None


    token=create_access_token(
        {
            "user_id": user.id,
            "company_id": user.company_id,
            "role": user.role
        }
    )

    return token