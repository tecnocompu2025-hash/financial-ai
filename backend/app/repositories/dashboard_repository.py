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
        def total_by_currency(model, column):
            results = self.db.query(model.currency, func.sum(column)).filter(model.user_id == user_id).group_by(model.currency).all()
            return {curr: float(amt) for curr, amt in results if amt}

        liability = total_by_currency(Liability, Liability.balance)
        mortgage = total_by_currency(Mortgage, Mortgage.current_balance)
        
        # Merge liabilities and mortgages
        liability_combined = {}
        for k, v in liability.items():
            liability_combined[k] = liability_combined.get(k, 0) + v
        for k, v in mortgage.items():
            liability_combined[k] = liability_combined.get(k, 0) + v

        return {
            "income_total": total_by_currency(Income, Income.amount),
            "expense_total": total_by_currency(Expense, Expense.amount),
            "asset_total": total_by_currency(Asset, Asset.value),
            "liability_total": liability_combined
        }
