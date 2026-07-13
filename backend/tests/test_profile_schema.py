import unittest

from pydantic import ValidationError

from app.schemas.profile import ProfileCreate


class ProfileSchemaTests(unittest.TestCase):
    def test_profile_rejects_invalid_financial_values(self):
        base = {"country": "Peru", "currency": "PEN", "age": 30, "marital_status": "Soltero", "children": 0, "retirement_age": 65, "financial_goal": "Ahorro", "monthly_salary": 2000}
        with self.assertRaises(ValidationError):
            ProfileCreate(**{**base, "monthly_salary": -1})
        with self.assertRaises(ValidationError):
            ProfileCreate(**{**base, "retirement_age": 20})
        with self.assertRaises(ValidationError):
            ProfileCreate(**{**base, "children": -1})

    def test_profile_accepts_valid_values(self):
        profile = ProfileCreate(country="Peru", currency="PEN", age=30, marital_status="Soltero", children=0, retirement_age=65, financial_goal="Ahorro", monthly_salary=2000)
        self.assertEqual(profile.currency, "PEN")
