from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.asset import AssetCreate, AssetResponse
from app.services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.post("/", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(data: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AssetService(db).create(current_user.id, data)


@router.get("/", response_model=list[AssetResponse])
def get_assets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AssetService(db).get_all(current_user.id)


@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(asset_id: int, data: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AssetService(db).update(asset_id, current_user.id, data)


@router.delete("/{asset_id}")
def delete_asset(asset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AssetService(db).delete(asset_id, current_user.id)
