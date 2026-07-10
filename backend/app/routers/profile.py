from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.profile import ProfileCreate
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.post("/")
def create_profile(
    profile: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print("\n======================================")
    print("ENTRÉ AL ENDPOINT /profile")
    print("Usuario ID:", current_user.id)
    print("Datos recibidos:", profile)
    print("======================================\n")

    service = ProfileService(db)

    new_profile = service.create(
        current_user.id,
        profile,
    )

    return {
        "message": "Perfil creado correctamente.",
        "profile": new_profile,
    }


@router.get("/")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ProfileService(db)

    return service.get_profile(current_user.id)