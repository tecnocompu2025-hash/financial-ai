from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalResponse
from app.services.goal_service import GoalService
router = APIRouter(prefix="/goals", tags=["Goals"])
@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create(data: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return GoalService(db).create(current_user.id, data)
@router.get("/", response_model=list[GoalResponse])
def get_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return GoalService(db).get_all(current_user.id)

@router.put("/{item_id}", response_model=GoalResponse)
def update(item_id: int, data: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return GoalService(db).update(item_id, current_user.id, data)
@router.delete("/{item_id}")
def delete(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return GoalService(db).delete(item_id, current_user.id)
