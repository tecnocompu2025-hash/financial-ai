from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseUpdate,
)
from app.services.expense_service import ExpenseService

router = APIRouter(
    prefix="/expense",
    tags=["Expense"],
)


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ExpenseService(db)

    return service.create(
        current_user.id,
        expense,
    )


@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ExpenseService(db)

    return service.get_all(current_user.id)


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ExpenseService(db)

    return service.get_by_id(
        expense_id,
        current_user.id,
    )


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ExpenseService(db)

    return service.update(
        expense_id,
        current_user.id,
        expense,
    )


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ExpenseService(db)

    return service.delete(
        expense_id,
        current_user.id,
    )
