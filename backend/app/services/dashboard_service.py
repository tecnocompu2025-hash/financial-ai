from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, db): self.repository = DashboardRepository(db)
    def summary(self, user_id: int):
        return self.repository.totals(user_id)
