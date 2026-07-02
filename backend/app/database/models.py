from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from datetime import datetime

from .connection import Base



class Company(Base):

    __tablename__ = "companies"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    users = relationship(
        "User",
        back_populates="company"
    )




class User(Base):

    __tablename__ = "users"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String,
        nullable=False
    )


    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )


    password_hash = Column(
        String,
        nullable=False
    )


    role = Column(
        String,
        default="recruiter"
    )


    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )


    company = relationship(
        "Company",
        back_populates="users"
    )