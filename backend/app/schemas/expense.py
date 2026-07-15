from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class ExpenseCreate(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    currency: str = "PEN"
    date: date
    description: str = Field(min_length=1, max_length=250)
    is_essential: bool = False


class ExpenseUpdate(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    currency: str = "PEN"
    date: date
    description: str = Field(min_length=1, max_length=250)
    is_essential: bool = False


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    category: str
    amount: float
    date: date
    description: str
    is_essential: bool
