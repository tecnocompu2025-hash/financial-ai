from pydantic import BaseModel


class ProfileCreate(BaseModel):
    country: str
    currency: str
    age: int
    marital_status: str
    children: int
    retirement_age: int
    financial_goal: str
    monthly_salary: float


class ProfileResponse(ProfileCreate):
    id: int

    class Config:
        from_attributes = True


class ProfileUpdate(ProfileCreate):
    pass
