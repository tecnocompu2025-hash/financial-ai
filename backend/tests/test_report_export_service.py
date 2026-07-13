import unittest

from app.schemas.report import FinancialReport, ReportFilters
from app.services.report_export_service import ReportExportService


class ReportExportServiceTests(unittest.TestCase):
    def setUp(self):
        self.report = FinancialReport(
            filters=ReportFilters(),
            summary={"income_total": 1000, "expense_total": 400, "passive_income_total": 50, "cash_flow": 600,
                     "asset_total": 5000, "liability_total": 1000, "net_worth": 4000, "debt_ratio": 20},
            categories=[], transactions=[], monthly_evolution=[],
            financial_health={"emergency_months": 2.5, "financial_freedom_percentage": 12.5},
            recommendations=["Aumenta el fondo de emergencia."],
        )

    def test_excel_contains_report_sections(self):
        stream = ReportExportService.excel(self.report)
        self.assertTrue(stream.getvalue().startswith(b"PK"))

    def test_pdf_is_generated(self):
        stream = ReportExportService.pdf(self.report)
        self.assertTrue(stream.getvalue().startswith(b"%PDF"))
