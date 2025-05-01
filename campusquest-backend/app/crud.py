from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import or_, func, cast, Integer

from . import models, schemas
from .auth import hash_password


# ✅ Create User
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ✅ Submit Aptitude Score
def submit_aptitude(db: Session, result: schemas.AptitudeSubmit):
    db_result = models.TestResult(
        username=result.username,
        score=result.score
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


# ✅ Get Latest Aptitude Score
def get_latest_aptitude_score(db: Session, username: str):
    return (
        db.query(models.TestResult)
        .filter(models.TestResult.username == username)
        .order_by(models.TestResult.id.desc())
        .first()
    )


# ✅ Get Colleges by Score, Percentage, Stream, and Course (Final Fixed)
def get_colleges_by_score(db: Session, score: int, percentage: float, stream: str, course: str):
    query = db.query(models.College)

    # ✅ Filter by 12th percentage
    query = query.filter(
        cast(func.replace(models.College.percentage_required, '%', ''), Integer) <= int(percentage)
    )

    # ✅ Filter strictly by aptitude score (max 15); entrance-exam scores are shown just as info
    query = query.filter(
        or_(
            models.College.aptitude_required_score <= score,
            models.College.aptitude_required_score.is_(None)
        )
    )

    # ✅ Cross-stream courses don't require stream match
    cross_stream_courses = ["MBA", "BCA", "BBA", "BA", "B.Com", "BA LLB", "LLB"]
    if stream != "Any" and course not in cross_stream_courses:
        query = query.filter(
            or_(
                models.College.stream == stream,
                models.College.stream == "Any"
            )
        )

    # ✅ Filter by selected course (unless "Any")
    if course != "Any":
        query = query.filter(models.College.preferred_course == course)

    return query.all()


# ✅ Apply to a College
def apply_college(db: Session, application: schemas.ApplicationCreate):
    existing = db.query(models.Application).filter(
        models.Application.username == application.username,
        models.Application.college_name == application.college_name
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="You’ve already tracked this college.")

    db_app = models.Application(
        username=application.username,
        college_name=application.college_name,
        status=application.status
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app


# ✅ Get All Applications for a User
def get_applications_by_username(db: Session, username: str):
    return (
        db.query(models.Application)
        .filter(models.Application.username == username)
        .all()
    )
