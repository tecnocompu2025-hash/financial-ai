from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import PasswordChange, PasswordResetConfirm, PasswordResetRequest, UserRegister, UserLogin
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_superuser, get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.get("/status")
def status():
    return {
        "module": "Authentication",
        "status": "OK",
    }


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        new_user = service.register(
            user.name,
            user.email,
            user.password,
        )

        return {
            "message": "Usuario creado correctamente.",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    token = service.login(
        user.email,
        user.password,
    )

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos.",
        )

    return token


@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_superuser": current_user.is_superuser,
    }


@router.post("/change-password")
def change_password(data: PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthService(db).change_password(current_user, data.current_password, data.new_password)

@router.post("/password-reset/request")
def password_reset_request(data: PasswordResetRequest, db: Session = Depends(get_db)):
    return AuthService(db).request_password_reset(data.email)

@router.post("/password-reset/confirm")
def password_reset_confirm(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    return AuthService(db).reset_password(data.token, data.new_password)

@router.get("/users")
def users(current_user: User = Depends(get_current_superuser), db: Session = Depends(get_db)):
    return [{"id": user.id, "name": user.name, "email": user.email} for user in db.query(User).order_by(User.id).all()]
