from pydantic import BaseModel, EmailStr
from typing import Optional

# =======================
# 🧑 User Schemas
# =======================

class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    password: str
    role: Optional[str] = "user"

class UserOut(BaseModel):
    username: str
    email: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


# =======================
# 🧠 Aptitude Test Schemas
# =======================

class AptitudeSubmit(BaseModel):
    username: str
    score: int

class TestResultOut(BaseModel):
    id: int
    username: str
    score: int
    submitted_at: Optional[str] = None  # ✅ Rename timestamp to submitted_at if needed

    class Config:
        from_attributes = True


# =======================
# 🏫 College Schemas
# =======================

class CollegeOut(BaseModel):
    college_name: str
    aptitude_required_score: Optional[int] = None  # ✅ New field
    exam_required_score: Optional[int] = None      # ✅ New field
    stream: str
    field: str
    preferred_course: str
    location: str
    contact_info: str
    website: str
    estimated_fees: str
    entrance_exam: str
    percentage_required: str

    class Config:
        from_attributes = True


# =======================
# 📝 Application Schemas
# =======================

class ApplicationCreate(BaseModel):
    username: str
    college_name: str
    status: Optional[str] = "Applied"

class ApplicationOut(BaseModel):
    id: int
    username: str
    college_name: str
    status: str

    class Config:
        from_attributes = True
