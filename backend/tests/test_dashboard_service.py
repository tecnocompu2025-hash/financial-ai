import unittest

from app.services.dashboard_service import DashboardService


class FakeDashboardRepository:
    def totals(self, user_id):
        return {"income_total": 2000.0, "expense_total": 500.0, "asset_total": 10000.0, "liability_total": 2500.0}


class DashboardServiceTests(unittest.TestCase):
    def test_summary_calculates_financial_indicators(self):
        service = DashboardService(None)
        service.repository = FakeDashboardRepository()
        summary = service.summary(1)
        self.assertEqual(summary["cash_flow"], 1500)
        self.assertEqual(summary["net_worth"], 7500)
        self.assertEqual(summary["savings_rate"], 75)
        self.assertEqual(summary["debt_total"], 2500)
        self.assertEqual(summary["debt_ratio"], 25)
