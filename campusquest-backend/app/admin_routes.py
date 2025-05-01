from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from . import database, models, auth, schemas
from .auth import get_current_admin_user, oauth2_scheme

router = APIRouter()


# ✅ Admin Login (Unified)
@router.post("/admin/login", tags=["Admin"])
def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if not user:
        raise HTTPException(status_code=403, detail="User not found")

    if not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }


# ✅ Get All Users (Admin only)
@router.get("/admin/users", response_model=list[schemas.UserOut], tags=["Admin"])
def get_all_users(
        db: Session = Depends(database.get_db),
        token: str = Security(oauth2_scheme),
        current_admin: models.User = Depends(get_current_admin_user)
):
    if current_admin.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    return db.query(models.User).all()


# ✅ View All Scores (Admin only) — with timestamp fix
@router.get("/admin/scores", tags=["Admin"])
def view_all_scores(
        db: Session = Depends(database.get_db),
        token: str = Security(oauth2_scheme),
        current_admin: models.User = Depends(get_current_admin_user)
):
    if current_admin.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    raw_scores = db.query(models.TestResult).all()

    return [
        {
            "id": score.id,
            "username": score.username,
            "score": score.score,
            "timestamp": score.timestamp.isoformat() if score.timestamp else None
        }
        for score in raw_scores
    ]


# ✅ View All Applications (Admin only)
@router.get("/admin/applications", response_model=list[schemas.ApplicationOut], tags=["Admin"])
def view_all_applications(
        db: Session = Depends(database.get_db),
        token: str = Security(oauth2_scheme),
        current_admin: models.User = Depends(get_current_admin_user)
):
    if current_admin.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    return db.query(models.Application).all()


# ✅ Delete User by Username (Admin only)
@router.delete("/admin/users/{username}", tags=["Admin"])
def delete_user(
        username: str,
        db: Session = Depends(database.get_db),
        token: str = Security(oauth2_scheme),
        current_admin: models.User = Depends(get_current_admin_user)
):
    if current_admin.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot delete admin accounts")

    db.delete(user)
    db.commit()

    return {"message": f"✅ User '{username}' deleted successfully"}
