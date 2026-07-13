from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.mortgage import AmortizationRow, CreditPaymentCreate, CreditPaymentResponse, MortgageCreate, MortgageResponse
from app.services.mortgage_service import MortgageService

router = APIRouter(prefix="/mortgages", tags=["Mortgages"])

@router.post("/", response_model=MortgageResponse, status_code=status.HTTP_201_CREATED)
def create(data: MortgageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).create(current_user.id, data)

@router.get("/", response_model=list[MortgageResponse])
def get_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).get_all(current_user.id)

@router.put("/{item_id}", response_model=MortgageResponse)
def update(item_id: int, data: MortgageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).update(item_id, current_user.id, data)

@router.delete("/{item_id}")
def delete(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).delete(item_id, current_user.id)

@router.post("/{item_id}/payments", response_model=CreditPaymentResponse, status_code=status.HTTP_201_CREATED)
def pay(item_id: int, data: CreditPaymentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).pay(item_id, current_user.id, data)

@router.get("/{item_id}/payments", response_model=list[CreditPaymentResponse])
def payments(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).payments(item_id, current_user.id)

@router.get("/{item_id}/amortization", response_model=list[AmortizationRow])
def amortization(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return MortgageService(db).amortization(item_id, current_user.id)
