from datetime import date, datetime, time

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.expense import Expense
from app.models.income import Income
from app.models.liability import Liability
from app.models.mortgage import Mortgage
from app.schemas.report import ReportFilters


class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def records(self, user_id: int, filters: ReportFilters):
        incomes = []
        expenses = []
        if filters.record_type in ("all", "income"):
            query = self.db.query(Income).filter(Income.user_id == user_id)
            query = self._income_filters(query, filters)
            incomes = query.order_by(Income.created_at.desc()).all()
        if filters.record_type in ("all", "expense"):
            query = self.db.query(Expense).filter(Expense.user_id == user_id)
            query = self._expense_filters(query, filters)
            expenses = query.order_by(Expense.date.desc()).all()
        return incomes, expenses

    def financial_totals(self, user_id: int):
        def total(model, column):
            return float(self.db.query(func.coalesce(func.sum(column), 0)).filter(model.user_id == user_id).scalar())
        assets = total(Asset, Asset.value)
        liabilities = total(Liability, Liability.balance) + total(Mortgage, Mortgage.current_balance)
        return assets, liabilities

    @staticmethod
    def _income_filters(query, filters: ReportFilters):
        if filters.category:
            query = query.filter(Income.category == filters.category)
        if filters.year:
            query = query.filter(func.extract("year", Income.created_at) == filters.year)
        if filters.month:
            query = query.filter(func.extract("month", Income.created_at) == filters.month)
        if filters.date_from:
            query = query.filter(Income.created_at >= datetime.combine(filters.date_from, time.min))
        if filters.date_to:
            query = query.filter(Income.created_at < datetime.combine(filters.date_to, time.max))
        return query

    @staticmethod
    def _expense_filters(query, filters: ReportFilters):
        if filters.category:
            query = query.filter(Expense.category == filters.category)
        if filters.year:
            query = query.filter(func.extract("year", Expense.date) == filters.year)
        if filters.month:
            query = query.filter(func.extract("month", Expense.date) == filters.month)
        if filters.date_from:
            query = query.filter(Expense.date >= filters.date_from)
        if filters.date_to:
            query = query.filter(Expense.date <= filters.date_to)
        return query
