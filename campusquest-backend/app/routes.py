from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import timedelta

from . import database, schemas, crud, auth, models
from .auth import get_current_user

router = APIRouter()


# ✅ DB Session Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ 1. Register User
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    return crud.create_user(db, user)


# ✅ 2. User Login (returns JWT token)
@router.post("/login")
def user_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = auth.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": token, "token_type": "bearer", "role": user.role}


# ✅ 3. Submit Aptitude Score (🔒) — Final version
@router.post("/aptitude", response_model=schemas.TestResultOut)
def submit_aptitude(
    result: schemas.AptitudeSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.username != result.username:
        raise HTTPException(status_code=403, detail="Cannot submit score for another user")

    try:
        db_result = crud.submit_aptitude(db, result)

        # Optional: Validate ORM return
        if not isinstance(db_result, models.TestResult):
            raise ValueError("Invalid object returned from DB")

        return db_result
    except Exception as e:
        print("🔥 Backend error in /aptitude:", str(e))
        raise HTTPException(status_code=500, detail="Failed to submit score. Contact admin.")


# ✅ 4. Get User’s Latest Score (🔒)
@router.get("/aptitude/{username}", response_model=schemas.TestResultOut)
def get_user_score(
    username: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if username != current_user.username:
        raise HTTPException(status_code=403, detail="Access denied")

    score_entry = crud.get_latest_aptitude_score(db, username)
    if not score_entry:
        raise HTTPException(status_code=404, detail="No aptitude score found")
    return score_entry


# ✅ 5. Get Colleges
@router.get("/colleges", response_model=list[schemas.CollegeOut])
def get_colleges(
    score: int,
    percentage: float,
    stream: str = "Any",
    course: str = "Any",
    db: Session = Depends(get_db)
):
    return crud.get_colleges_by_score(db, score, percentage, stream, course)


# ✅ 6. Apply to College (🔒)
@router.post("/apply", response_model=schemas.ApplicationOut)
def apply_to_college(
    application: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.username != application.username:
        raise HTTPException(status_code=403, detail="Cannot apply for another user")
    return crud.apply_college(db, application)


# ✅ 7. Get Applications (🔒)
@router.get("/applications/{username}", response_model=list[schemas.ApplicationOut])
def get_user_applications(
    username: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.username != username:
        raise HTTPException(status_code=403, detail="Cannot view other users' applications")
    return crud.get_applications_by_username(db, username)


# ✅ 8. Health Check
@router.get("/health")
def health_check():
    try:
        db = database.SessionLocal()
        db.execute(text("SELECT 1"))
        return {"status": "✅ Database connection successful!"}
    except Exception as e:
        return {"status": "❌ Database connection failed", "error": str(e)}
    finally:
        db.close()
