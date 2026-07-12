from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.asset import Asset
from app.models.user import User
from app.schemas.asset import AssetCreate, AssetResponse

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.post("/", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(data: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asset = Asset(user_id=current_user.id, **data.model_dump())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("/", response_model=list[AssetResponse])
def get_assets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Asset).filter(Asset.user_id == current_user.id).order_by(Asset.id.desc()).all()


@router.delete("/{asset_id}")
def delete_asset(asset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.user_id == current_user.id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    db.delete(asset)
    db.commit()
    return {"message": "Activo eliminado correctamente"}
