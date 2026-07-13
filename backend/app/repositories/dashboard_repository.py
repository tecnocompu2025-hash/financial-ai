from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.expense import Expense
from app.models.income import Income
from app.models.liability import Liability
from app.models.mortgage import Mortgage


class DashboardRepository:
    def __init__(self, db: Session): self.db = db

    def totals(self, user_id: int):
        def total(model, column):
            return float(self.db.query(func.coalesce(func.sum(column), 0)).filter(model.user_id == user_id).scalar())
        return {"income_total": total(Income, Income.amount), "expense_total": total(Expense, Expense.amount), "asset_total": total(Asset, Asset.value), "liability_total": total(Liability, Liability.balance) + total(Mortgage, Mortgage.current_balance)}
