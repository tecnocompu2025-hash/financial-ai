from pydantic import BaseModel
from datetime import datetime


class IncomeCreate(BaseModel):
    name: str
    amount: float
    category: str
    frequency: str
    is_passive: bool = False


class IncomeUpdate(BaseModel):
    name: str
    amount: float
    category: str
    frequency: str
    is_passive: bool


class IncomeResponse(BaseModel):
    id: int
    user_id: int
    name: str
    amount: float
    category: str
    frequency: str
    is_passive: bool
    created_at: datetime

    class Config:
        from_attributes = True