from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ReportFilters(BaseModel):
    month: int | None = Field(default=None, ge=1, le=12)
    year: int | None = Field(default=None, ge=2000, le=2100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    record_type: Literal["all", "income", "expense"] = "all"
    date_from: date | None = None
    date_to: date | None = None

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.date_from and self.date_to and self.date_from > self.date_to:
            raise ValueError("date_from no puede ser posterior a date_to")
        return self


class ReportTransaction(BaseModel):
    id: int
    record_type: Literal["income", "expense"]
    name: str
    category: str
    amount: float
    date: date
    is_passive: bool = False


class MonthlyReportPoint(BaseModel):
    month: str
    income: float
    expense: float
    balance: float


class ReportSummary(BaseModel):
    income_total: float
    expense_total: float
    passive_income_total: float
    cash_flow: float
    asset_total: float
    liability_total: float
    net_worth: float
    debt_ratio: float


class FinancialReport(BaseModel):
    filters: ReportFilters
    summary: ReportSummary
    categories: list[str]
    transactions: list[ReportTransaction]
    monthly_evolution: list[MonthlyReportPoint]
    financial_health: dict[str, float]
    recommendations: list[str]
