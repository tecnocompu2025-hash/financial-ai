from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.liability import LiabilityCreate, LiabilityResponse
from app.services.liability_service import LiabilityService

router = APIRouter(prefix="/liabilities", tags=["Liabilities"])

@router.post("/", response_model=LiabilityResponse, status_code=status.HTTP_201_CREATED)
def create(data: LiabilityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return LiabilityService(db).create(current_user.id, data)

@router.get("/", response_model=list[LiabilityResponse])
def get_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return LiabilityService(db).get_all(current_user.id)

@router.put("/{item_id}", response_model=LiabilityResponse)
def update(item_id: int, data: LiabilityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return LiabilityService(db).update(item_id, current_user.id, data)

@router.delete("/{item_id}")
def delete(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return LiabilityService(db).delete(item_id, current_user.id)
