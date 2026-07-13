from datetime import date
from types import SimpleNamespace
import unittest

from app.services.mortgage_service import MortgageService


class FakeRepository:
    def __init__(self, item): self.item = item
    def get_by_id(self, item_id, user_id): return self.item
    def add_payment(self, item, amount, interest_amount, principal_amount, paid_date):
        return SimpleNamespace(id=1, amount=amount, interest_amount=interest_amount, principal_amount=principal_amount, paid_date=paid_date)


class MortgageServiceTests(unittest.TestCase):
    def setUp(self):
        self.item = SimpleNamespace(id=1, user_id=1, name="Prueba", principal=10000.0, current_balance=10000.0, credit_type="Personal", credit_limit=None, annual_interest_rate=12.0, term_months=12, remaining_months=12, start_date=date(2026, 1, 1), next_due_date=date(2026, 2, 1))
        self.service = MortgageService(None)
        self.service.repository = FakeRepository(self.item)

    def test_zero_interest_payment_divides_balance_by_remaining_months(self):
        self.item.annual_interest_rate = 0
        summary = self.service._summary(self.item)
        self.assertEqual(summary["monthly_payment"], 833.33)

    def test_amortization_reaches_zero_balance(self):
        rows = self.service.amortization(1, 1)
        self.assertGreater(len(rows), 0)
        self.assertEqual(rows[-1]["remaining_balance"], 0)

    def test_partial_payment_does_not_advance_due_date_or_months(self):
        before_date = self.item.next_due_date
        before_months = self.item.remaining_months
        self.service.pay(1, 1, SimpleNamespace(amount=50.0, paid_date=date(2026, 2, 1)))
        self.assertEqual(self.item.next_due_date, before_date)
        self.assertEqual(self.item.remaining_months, before_months)

    def test_full_payment_advances_due_date_and_months(self):
        expected = self.service._summary(self.item)["monthly_payment"]
        self.service.pay(1, 1, SimpleNamespace(amount=expected, paid_date=date(2026, 2, 1)))
        self.assertEqual(self.item.remaining_months, 11)
        self.assertEqual(self.item.next_due_date, date(2026, 3, 1))

    def test_paid_credit_rejects_another_payment(self):
        self.item.current_balance = 0
        with self.assertRaises(Exception):
            self.service.pay(1, 1, SimpleNamespace(amount=100.0, paid_date=date(2026, 2, 1)))
