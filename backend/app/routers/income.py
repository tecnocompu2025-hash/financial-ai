from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.income import (
    IncomeCreate,
    IncomeUpdate,
)
from app.services.income_service import IncomeService

router = APIRouter(
    prefix="/income",
    tags=["Income"],
)


@router.post("/")
def create_income(
    income: IncomeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = IncomeService(db)

    return service.create(
        current_user.id,
        income,
    )


@router.get("/")
def get_incomes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = IncomeService(db)

    return service.get_all(current_user.id)


@router.get("/{income_id}")
def get_income(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = IncomeService(db)

    return service.get_by_id(
        income_id,
        current_user.id,
    )


@router.put("/{income_id}")
def update_income(
    income_id: int,
    income: IncomeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = IncomeService(db)

    return service.update(
        income_id,
        current_user.id,
        income,
    )


@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = IncomeService(db)

    return service.delete(
        income_id,
        current_user.id,
    )