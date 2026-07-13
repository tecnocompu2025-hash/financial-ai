from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class IncomeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=50)
    frequency: str = Field(min_length=1, max_length=30)
    is_passive: bool = False


class IncomeUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=50)
    frequency: str = Field(min_length=1, max_length=30)
    is_passive: bool


class IncomeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    name: str
    amount: float
    category: str
    frequency: str
    is_passive: bool
    created_at: datetime
