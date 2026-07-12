from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.liability import Liability
from app.models.user import User
from app.schemas.liability import LiabilityCreate, LiabilityResponse

router = APIRouter(prefix="/liabilities", tags=["Liabilities"])

@router.post("/", response_model=LiabilityResponse, status_code=status.HTTP_201_CREATED)
def create(data: LiabilityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = Liability(user_id=current_user.id, **data.model_dump())
    db.add(item); db.commit(); db.refresh(item)
    return item

@router.get("/", response_model=list[LiabilityResponse])
def get_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Liability).filter(Liability.user_id == current_user.id).order_by(Liability.id.desc()).all()

@router.delete("/{item_id}")
def delete(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Liability).filter(Liability.id == item_id, Liability.user_id == current_user.id).first()
    if not item: raise HTTPException(status_code=404, detail="Deuda no encontrada")
    db.delete(item); db.commit()
    return {"message": "Deuda eliminada correctamente"}
