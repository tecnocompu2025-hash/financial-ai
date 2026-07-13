import unittest
from pydantic import ValidationError
from app.schemas.income import IncomeCreate
from app.schemas.expense import ExpenseCreate
from app.schemas.asset import AssetCreate
from app.schemas.liability import LiabilityCreate

class SchemaTests(unittest.TestCase):
    def test_income_rejects_non_positive_amount(self):
        with self.assertRaises(ValidationError):
            IncomeCreate(name="Salario", category="Trabajo", frequency="Mensual", amount=0)

    def test_financial_records_reject_non_positive_values(self):
        with self.assertRaises(ValidationError):
            ExpenseCreate(category="Comida", description="Comida", amount=0, date="2026-01-01")
        with self.assertRaises(ValidationError):
            AssetCreate(name="Ahorro", category="Efectivo", value=0)
        with self.assertRaises(ValidationError):
            LiabilityCreate(name="Préstamo", category="Personal", balance=0)
