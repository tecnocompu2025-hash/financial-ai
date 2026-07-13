import unittest
from datetime import date, datetime
from types import SimpleNamespace

from app.schemas.report import ReportFilters
from app.services.report_service import ReportService


class FakeReportRepository:
    def records(self, user_id, filters):
        incomes = [
            SimpleNamespace(id=1, name="Salario", category="Trabajo", amount=1000, created_at=datetime(2026, 7, 1), is_passive=False),
            SimpleNamespace(id=2, name="Renta", category="Inversion", amount=200, created_at=datetime(2026, 7, 5), is_passive=True),
        ]
        expenses = [
            SimpleNamespace(id=3, description="Mercado", category="Alimentacion", amount=300, date=date(2026, 7, 3), is_essential=True),
        ]
        if filters.record_type == "income":
            return incomes, []
        if filters.record_type == "expense":
            return [], expenses
        return incomes, expenses

    def financial_totals(self, user_id):
        return 5000.0, 1200.0

    def productive_asset_total(self, user_id):
        return 1500.0


class ReportServiceTests(unittest.TestCase):
    def setUp(self):
        self.service = ReportService(None)
        self.service.repository = FakeReportRepository()

    def test_report_calculates_totals_and_indicators(self):
        report = self.service.financial_report(1, ReportFilters())
        self.assertEqual(report.summary.income_total, 1200)
        self.assertEqual(report.summary.expense_total, 300)
        self.assertEqual(report.summary.cash_flow, 900)
        self.assertEqual(report.summary.net_worth, 3800)
        self.assertEqual(report.financial_health["financial_freedom_percentage"], 200 / 300 * 100)
        self.assertEqual(len(report.monthly_evolution), 1)

    def test_record_type_filter_affects_report_totals(self):
        report = self.service.financial_report(1, ReportFilters(record_type="expense"))
        self.assertEqual(report.summary.income_total, 0)
        self.assertEqual(report.summary.expense_total, 300)
        self.assertEqual(len(report.transactions), 1)
