from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Float
)

from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from .connection import Base
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,unique=True,nullable=False)
    created_at = Column(DateTime,default=datetime.utcnow)
    users = relationship("User",back_populates="company")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    email = Column(String,unique=True,index=True,nullable=False)
    password_hash = Column(String,nullable=False)
    role = Column(String,default="recruiter")
    company_id = Column(Integer,ForeignKey("companies.id"))
    company = relationship("Company",back_populates="users")

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=True, unique=True, index=True)
    phone = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resumes = relationship("Resume",back_populates="candidate",cascade="all, delete-orphan")
    skills = relationship("CandidateSkill",cascade="all, delete-orphan")
    educations = relationship("CandidateEducation",cascade="all, delete-orphan")
    experiences = relationship("CandidateExperience",cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=True)  # pdf, docx
    raw_text = Column(Text, nullable=True)
    parsed_data = Column(JSONB, nullable=True)
    summary = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    candidate = relationship("Candidate",back_populates="resumes")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_by = Column(Integer,ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime,default=datetime.utcnow)

class Application(Base):
    __tablename__ = "applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True),ForeignKey("candidates.id"),nullable=False)
    resume_id = Column(UUID(as_uuid=True),ForeignKey("resumes.id"),nullable=False)
    job_id = Column(UUID(as_uuid=True),ForeignKey("jobs.id"),nullable=False)
    score = Column(Float)
    status = Column(String,default="pending")
    ai_summary = Column(Text)
    created_at = Column(DateTime,default=datetime.utcnow)

class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True),ForeignKey("candidates.id"),nullable=False)
    skill = Column(String, nullable=False)

class CandidateEducation(Base):
    __tablename__ = "candidate_educations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True),ForeignKey("candidates.id"),nullable=False)
    education_text = Column(Text, nullable=False)

class CandidateExperience(Base):
    __tablename__ = "candidate_experiences"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True),ForeignKey("candidates.id"),nullable=False)
    title = Column(String)
    company = Column(String)
    period = Column(String)
    description = Column(Text)