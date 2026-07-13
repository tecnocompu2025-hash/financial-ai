from pydantic import BaseModel


class DashboardSummary(BaseModel):
    income_total: float
    expense_total: float
    asset_total: float
    liability_total: float
    cash_flow: float
    net_worth: float
    savings_rate: float
