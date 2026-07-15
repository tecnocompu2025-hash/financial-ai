from pydantic import BaseModel


class DashboardSummary(BaseModel):
    income_total: dict[str, float]
    expense_total: dict[str, float]
    asset_total: dict[str, float]
    liability_total: dict[str, float]
