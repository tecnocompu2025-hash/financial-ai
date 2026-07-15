from datetime import date
from pydantic import BaseModel, Field, model_validator

class MortgageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    principal: float = Field(gt=0)
    currency: str = "PEN"
    credit_type: str = Field(min_length=1, max_length=50)
    credit_limit: float | None = Field(default=None, gt=0)
    annual_interest_rate: float = Field(ge=0, le=100)
    term_months: int = Field(ge=1, le=600)
    start_date: date

    @model_validator(mode="after")
    def validate_card_limit(self):
        if self.credit_type == "Tarjetero" and (self.credit_limit is None or self.credit_limit < self.principal):
            raise ValueError("La tarjeta requiere un límite mayor o igual al saldo usado")
        return self

class MortgageResponse(MortgageCreate):
    id: int
    user_id: int
    monthly_payment: float
    total_interest: float
    next_interest: float
    next_principal: float
    current_balance: float
    remaining_months: int
    next_due_date: date

class CreditPaymentCreate(BaseModel):
    amount: float = Field(gt=0)
    currency: str = "PEN"
    paid_date: date

class CreditPaymentResponse(CreditPaymentCreate):
    id: int
    interest_amount: float
    principal_amount: float

class AmortizationRow(BaseModel):
    installment: int
    payment: float
    interest: float
    principal: float
    remaining_balance: float
