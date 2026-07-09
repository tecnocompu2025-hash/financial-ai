from datetime import date

from pydantic import BaseModel


class IncomeCreate(BaseModel):
    source: str
    amount: float
    date: date
    description: str


class IncomeResponse(IncomeCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True