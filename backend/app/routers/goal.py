from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.goal import Goal
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalResponse
router = APIRouter(prefix="/goals", tags=["Goals"])
@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create(data: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = Goal(user_id=current_user.id, **data.model_dump()); db.add(item); db.commit(); db.refresh(item); return item
@router.get("/", response_model=list[GoalResponse])
def get_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.id.desc()).all()

@router.put("/{item_id}", response_model=GoalResponse)
def update(item_id: int, data: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Goal).filter(Goal.id == item_id, Goal.user_id == current_user.id).first()
    if not item: raise HTTPException(status_code=404, detail="Meta no encontrada")
    for key, value in data.model_dump().items(): setattr(item, key, value)
    db.commit(); db.refresh(item)
    return item
@router.delete("/{item_id}")
def delete(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Goal).filter(Goal.id == item_id, Goal.user_id == current_user.id).first()
    if not item: raise HTTPException(status_code=404, detail="Meta no encontrada")
    db.delete(item); db.commit(); return {"message": "Meta eliminada"}
