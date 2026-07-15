from collections import defaultdict

from app.repositories.report_repository import ReportRepository
from app.schemas.report import FinancialReport, MonthlyReportPoint, ReportFilters, ReportTransaction


class ReportService:
    def __init__(self, db):
        self.repository = ReportRepository(db)

    def financial_report(self, user_id: int, filters: ReportFilters) -> FinancialReport:
        incomes, expenses = self.repository.records(user_id, filters)
        
        base_currency = filters.base_currency
        rate = filters.exchange_rate

        def convert(amount, currency):
            if currency == base_currency:
                return amount
            if currency == "USD" and base_currency != "USD":
                return amount * rate if rate > 0 else amount
            if currency != "USD" and base_currency == "USD":
                return amount / rate if rate > 0 else amount
            return amount

        transactions = [
            ReportTransaction(id=item.id, record_type="income", name=item.name, category=item.category,
                              amount=convert(float(item.amount), item.currency), date=item.created_at.date(), is_passive=item.is_passive)
            for item in incomes
        ] + [
            ReportTransaction(id=item.id, record_type="expense", name=item.description, category=item.category,
                              amount=convert(float(item.amount), item.currency), date=item.date)
            for item in expenses
        ]
        transactions.sort(key=lambda item: item.date, reverse=True)
        income_total = sum(item.amount for item in transactions if item.record_type == "income")
        expense_total = sum(item.amount for item in transactions if item.record_type == "expense")
        passive_income = sum(item.amount for item in transactions if item.record_type == "income" and item.is_passive)
        
        assets_dict, liabilities_dict = self.repository.financial_totals(user_id)
        productive_assets_dict = self.repository.productive_asset_total(user_id)
        
        assets = sum(convert(amt, curr) for curr, amt in assets_dict.items())
        liabilities = sum(convert(amt, curr) for curr, amt in liabilities_dict.items())
        productive_assets = sum(convert(amt, curr) for curr, amt in productive_assets_dict.items())
        
        essential_expenses = sum(convert(float(item.amount), item.currency) for item in expenses if item.is_essential)
        
        emergency_months = assets / essential_expenses if essential_expenses else 0.0
        financial_freedom = passive_income / expense_total * 100 if expense_total else 0.0
        recommendations = self._recommendations(assets, liabilities, expense_total, passive_income, emergency_months, transactions)
        monthly = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
        for item in transactions:
            point = monthly[item.date.strftime("%Y-%m")]
            point[item.record_type] += item.amount
        evolution = [
            MonthlyReportPoint(month=month, income=values["income"], expense=values["expense"],
                               balance=values["income"] - values["expense"])
            for month, values in sorted(monthly.items())
        ]
        return FinancialReport(
            filters=filters,
            summary={"income_total": income_total, "expense_total": expense_total,
                     "passive_income_total": passive_income, "cash_flow": income_total - expense_total,
                     "asset_total": assets, "liability_total": liabilities, "net_worth": assets - liabilities,
                     "debt_ratio": liabilities / assets * 100 if assets else 0.0},
            categories=sorted({item.category for item in transactions}),
            transactions=transactions,
            monthly_evolution=evolution,
            financial_health={"emergency_fund_available": assets, "essential_monthly_expenses": essential_expenses,
                              "emergency_months": emergency_months, "financial_freedom_percentage": financial_freedom,
                              "productive_assets": productive_assets},
            recommendations=recommendations,
        )

    @staticmethod
    def _recommendations(assets, liabilities, expenses, passive_income, emergency_months, transactions):
        messages = []
        if assets and liabilities / assets >= 0.6:
            messages.append("Tus deudas representan más del 60% de tus activos. Prioriza reducir las de mayor interés.")
        if expenses and emergency_months < 3:
            messages.append("Tu fondo de emergencia cubre menos de tres meses de gastos esenciales. Aumenta este fondo gradualmente.")
        if expenses and passive_income / expenses < 0.25:
            messages.append("Tus ingresos pasivos todavía cubren una parte pequeña de tus gastos. Evalúa fortalecer activos productivos.")
        restaurant_spending = sum(item.amount for item in transactions if item.record_type == "expense" and "restaur" in item.category.lower())
        if expenses and restaurant_spending / expenses >= 0.15:
            messages.append("Los gastos en restaurantes superan el 15% de los gastos filtrados. Revisa esta categoría para liberar ahorro.")
        if not messages:
            messages.append("Tus indicadores no muestran una alerta prioritaria con los filtros actuales. Mantén el seguimiento mensual.")
        return messages
