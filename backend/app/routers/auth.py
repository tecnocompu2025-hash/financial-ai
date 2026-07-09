from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserRegister, UserLogin
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user
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
    }