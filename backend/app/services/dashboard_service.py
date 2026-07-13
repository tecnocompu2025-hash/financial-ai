from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, db): self.repository = DashboardRepository(db)
    def summary(self, user_id: int):
        data = self.repository.totals(user_id)
        data["cash_flow"] = data["income_total"] - data["expense_total"]
        data["net_worth"] = data["asset_total"] - data["liability_total"]
        data["savings_rate"] = data["cash_flow"] / data["income_total"] * 100 if data["income_total"] else 0.0
        return data
