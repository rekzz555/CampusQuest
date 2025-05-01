from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base
import enum

# ✅ Enum for user roles
class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"

# ✅ Users Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default="user")

    applications = relationship("Application", back_populates="user", cascade="all, delete")
    test_results = relationship("TestResult", back_populates="user", cascade="all, delete")

# ✅ Colleges Table
class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    college_name = Column(String(100), nullable=False)

    # ✅ Separated score fields
    aptitude_required_score = Column(Integer, nullable=True)   # Out of 15
    exam_required_score = Column(Integer, nullable=True)       # Like JEE, CAT, etc.

    stream = Column(String(50), default="Any")
    field = Column(String(50), default="Any")
    preferred_course = Column(String(100), default="Any")
    location = Column(String(100), default="Not Available")
    contact_info = Column(String(150), default="Not Available")
    website = Column(String(150), default="Not Available")
    estimated_fees = Column(String(100), default="Not Available")
    entrance_exam = Column(String(50), default="None")
    percentage_required = Column(String(10), default="NA")

    applications = relationship("Application", back_populates="college")

# ✅ Applications Table
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), ForeignKey("users.username"))
    college_name = Column(String(255), ForeignKey("colleges.college_name"))
    status = Column(String(20), default="Applied")

    user = relationship("User", back_populates="applications")
    college = relationship("College", back_populates="applications")

# ✅ Test Results Table
class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), ForeignKey("users.username"))
    score = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="test_results")
