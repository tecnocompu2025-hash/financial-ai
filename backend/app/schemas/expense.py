from datetime import date

from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    category: str
    amount: float
    date: date
    description: str


class ExpenseResponse(ExpenseCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True