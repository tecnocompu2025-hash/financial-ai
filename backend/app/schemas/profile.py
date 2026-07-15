from pydantic import BaseModel, Field, model_validator


class ProfileCreate(BaseModel):
    country: str = Field(min_length=2, max_length=100)
    currency: str = Field(min_length=1, max_length=10)
    age: int = Field(ge=18, le=120)
    marital_status: str = Field(min_length=1, max_length=50)
    children: int = Field(ge=0, le=50)
    retirement_age: int = Field(ge=18, le=120)
    financial_goal: str = Field(min_length=1, max_length=255)
    monthly_salary: float = Field(ge=0)
    custom_exchange_rate: float | None = None
    donation_percentage: float = Field(ge=0, le=100, default=0.0)
    quality_of_life_percentage: float = Field(ge=0, le=100, default=0.0)

    @model_validator(mode="after")
    def retirement_must_follow_current_age(self):
        if self.retirement_age < self.age:
            raise ValueError("La edad de retiro no puede ser menor que la edad actual")
        return self


class ProfileResponse(ProfileCreate):
    id: int

    class Config:
        from_attributes = True


class ProfileUpdate(ProfileCreate):
    pass
