import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.session import Base, get_db
from app.models import User  # Imports all models so SQLAlchemy metadata is complete.
from main import app


class HttpIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        cls.session_factory = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=cls.engine,
        )

        def override_get_db():
            db = cls.session_factory()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        app.dependency_overrides.clear()
        cls.engine.dispose()

    def setUp(self):
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)

    def register_and_login(self, email: str, name: str = "Usuario") -> str:
        password = "ClaveSegura123"
        response = self.client.post(
            "/auth/register",
            json={"name": name, "email": email, "password": password},
        )
        self.assertEqual(response.status_code, 200, response.text)

        response = self.client.post(
            "/auth/login",
            json={"email": email, "password": password},
        )
        self.assertEqual(response.status_code, 200, response.text)
        return response.json()["access_token"]

    @staticmethod
    def authorization(token: str) -> dict[str, str]:
        return {"Authorization": f"Bearer {token}"}

    def test_authentication_and_current_user_flow(self):
        token = self.register_and_login("persona@example.com", "Persona Uno")

        response = self.client.get("/auth/me", headers=self.authorization(token))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], "persona@example.com")
        self.assertFalse(response.json()["is_superuser"])

    def test_protected_route_rejects_missing_and_invalid_tokens(self):
        missing = self.client.get("/income/")
        invalid = self.client.get(
            "/income/", headers=self.authorization("token-invalido")
        )

        self.assertIn(missing.status_code, (401, 403))
        self.assertEqual(invalid.status_code, 401)

    def test_income_crud_is_isolated_by_user(self):
        owner_token = self.register_and_login("owner@example.com")
        other_token = self.register_and_login("other@example.com")
        payload = {
            "name": "Salario",
            "amount": 3500,
            "category": "Trabajo",
            "frequency": "Mensual",
            "is_passive": False,
        }

        created = self.client.post(
            "/income/", json=payload, headers=self.authorization(owner_token)
        )
        self.assertEqual(created.status_code, 201, created.text)
        income_id = created.json()["id"]

        owner_list = self.client.get(
            "/income/", headers=self.authorization(owner_token)
        )
        other_list = self.client.get(
            "/income/", headers=self.authorization(other_token)
        )
        other_read = self.client.get(
            f"/income/{income_id}", headers=self.authorization(other_token)
        )

        self.assertEqual(len(owner_list.json()), 1)
        self.assertEqual(other_list.json(), [])
        self.assertEqual(other_read.status_code, 404)

        updated = self.client.put(
            f"/income/{income_id}",
            json={**payload, "amount": 3800},
            headers=self.authorization(owner_token),
        )
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(updated.json()["amount"], 3800)

        deleted = self.client.delete(
            f"/income/{income_id}", headers=self.authorization(owner_token)
        )
        self.assertEqual(deleted.status_code, 200)
        self.assertEqual(
            self.client.get(
                f"/income/{income_id}", headers=self.authorization(owner_token)
            ).status_code,
            404,
        )

    def assert_crud_isolated_by_user(
        self,
        path: str,
        payload: dict,
        updated_payload: dict,
        updated_field: str,
    ):
        owner_token = self.register_and_login("owner@example.com")
        other_token = self.register_and_login("other@example.com")

        created = self.client.post(
            f"{path}/", json=payload, headers=self.authorization(owner_token)
        )
        self.assertEqual(created.status_code, 201, created.text)
        item_id = created.json()["id"]

        owner_list = self.client.get(
            f"{path}/", headers=self.authorization(owner_token)
        )
        other_list = self.client.get(
            f"{path}/", headers=self.authorization(other_token)
        )
        self.assertEqual(len(owner_list.json()), 1)
        self.assertEqual(other_list.json(), [])

        other_update = self.client.put(
            f"{path}/{item_id}",
            json=updated_payload,
            headers=self.authorization(other_token),
        )
        other_delete = self.client.delete(
            f"{path}/{item_id}", headers=self.authorization(other_token)
        )
        self.assertEqual(other_update.status_code, 404)
        self.assertEqual(other_delete.status_code, 404)

        updated = self.client.put(
            f"{path}/{item_id}",
            json=updated_payload,
            headers=self.authorization(owner_token),
        )
        self.assertEqual(updated.status_code, 200, updated.text)
        self.assertEqual(updated.json()[updated_field], updated_payload[updated_field])

        deleted = self.client.delete(
            f"{path}/{item_id}", headers=self.authorization(owner_token)
        )
        self.assertEqual(deleted.status_code, 200, deleted.text)
        owner_list = self.client.get(
            f"{path}/", headers=self.authorization(owner_token)
        )
        self.assertEqual(owner_list.json(), [])

    def test_expense_crud_is_isolated_by_user(self):
        payload = {
            "category": "Vivienda",
            "amount": 900,
            "date": "2026-07-13",
            "description": "Alquiler",
            "is_essential": True,
        }
        self.assert_crud_isolated_by_user(
            "/expense",
            payload,
            {**payload, "amount": 950, "description": "Alquiler actualizado"},
            "amount",
        )

    def test_asset_crud_is_isolated_by_user(self):
        payload = {
            "name": "Fondo indexado",
            "category": "Inversiones",
            "value": 5000,
            "classification": "productive",
        }
        self.assert_crud_isolated_by_user(
            "/assets",
            payload,
            {**payload, "value": 5400},
            "value",
        )

    def test_liability_crud_is_isolated_by_user(self):
        payload = {
            "name": "Tarjeta",
            "category": "Consumo",
            "balance": 1200,
            "classification": "bad",
            "annual_interest_rate": 45,
        }
        self.assert_crud_isolated_by_user(
            "/liabilities",
            payload,
            {**payload, "balance": 1000},
            "balance",
        )

    def test_goal_crud_is_isolated_by_user(self):
        payload = {
            "name": "Fondo de emergencia",
            "target_amount": 12000,
            "current_amount": 2500,
        }
        self.assert_crud_isolated_by_user(
            "/goals",
            payload,
            {**payload, "current_amount": 3000},
            "current_amount",
        )

    def test_profile_create_read_and_update_are_isolated_by_user(self):
        owner_token = self.register_and_login("owner@example.com")
        other_token = self.register_and_login("other@example.com")
        payload = {
            "country": "Peru",
            "currency": "PEN",
            "age": 35,
            "marital_status": "Soltero",
            "children": 0,
            "retirement_age": 65,
            "financial_goal": "Independencia financiera",
            "monthly_salary": 4500,
        }

        created = self.client.post(
            "/profile/", json=payload, headers=self.authorization(owner_token)
        )
        self.assertEqual(created.status_code, 200, created.text)
        duplicate = self.client.post(
            "/profile/", json=payload, headers=self.authorization(owner_token)
        )
        self.assertEqual(duplicate.status_code, 409)

        owner_profile = self.client.get(
            "/profile/", headers=self.authorization(owner_token)
        )
        other_profile = self.client.get(
            "/profile/", headers=self.authorization(other_token)
        )
        self.assertEqual(owner_profile.json()["country"], "Peru")
        self.assertIsNone(other_profile.json())

        updated_payload = {**payload, "monthly_salary": 5000}
        other_update = self.client.put(
            "/profile/",
            json=updated_payload,
            headers=self.authorization(other_token),
        )
        owner_update = self.client.put(
            "/profile/",
            json=updated_payload,
            headers=self.authorization(owner_token),
        )
        self.assertEqual(other_update.status_code, 404)
        self.assertEqual(owner_update.status_code, 200, owner_update.text)
        self.assertEqual(owner_update.json()["monthly_salary"], 5000)

    def test_credit_payments_and_amortization_are_isolated_by_user(self):
        owner_token = self.register_and_login("owner@example.com")
        other_token = self.register_and_login("other@example.com")
        payload = {
            "name": "Prestamo sin intereses",
            "principal": 1200,
            "credit_type": "Personal",
            "credit_limit": None,
            "annual_interest_rate": 0,
            "term_months": 12,
            "start_date": "2026-07-13",
        }

        created = self.client.post(
            "/mortgages/", json=payload, headers=self.authorization(owner_token)
        )
        self.assertEqual(created.status_code, 201, created.text)
        credit_id = created.json()["id"]
        self.assertEqual(created.json()["monthly_payment"], 100)

        other_list = self.client.get(
            "/mortgages/", headers=self.authorization(other_token)
        )
        other_payment = self.client.post(
            f"/mortgages/{credit_id}/payments",
            json={"amount": 100, "paid_date": "2026-07-13"},
            headers=self.authorization(other_token),
        )
        other_amortization = self.client.get(
            f"/mortgages/{credit_id}/amortization",
            headers=self.authorization(other_token),
        )
        self.assertEqual(other_list.json(), [])
        self.assertEqual(other_payment.status_code, 404)
        self.assertEqual(other_amortization.status_code, 404)

        payment = self.client.post(
            f"/mortgages/{credit_id}/payments",
            json={"amount": 100, "paid_date": "2026-07-13"},
            headers=self.authorization(owner_token),
        )
        history = self.client.get(
            f"/mortgages/{credit_id}/payments",
            headers=self.authorization(owner_token),
        )
        amortization = self.client.get(
            f"/mortgages/{credit_id}/amortization",
            headers=self.authorization(owner_token),
        )
        self.assertEqual(payment.status_code, 201, payment.text)
        self.assertEqual(payment.json()["principal_amount"], 100)
        self.assertEqual(len(history.json()), 1)
        self.assertEqual(len(amortization.json()), 11)
        self.assertEqual(amortization.json()[-1]["remaining_balance"], 0)

        other_delete = self.client.delete(
            f"/mortgages/{credit_id}", headers=self.authorization(other_token)
        )
        owner_delete = self.client.delete(
            f"/mortgages/{credit_id}", headers=self.authorization(owner_token)
        )
        self.assertEqual(other_delete.status_code, 404)
        self.assertEqual(owner_delete.status_code, 200, owner_delete.text)

    def create_financial_dataset(self, token: str):
        headers = self.authorization(token)
        records = [
            (
                "/income/",
                {
                    "name": "Salario",
                    "amount": 5000,
                    "category": "Trabajo",
                    "frequency": "Mensual",
                    "is_passive": False,
                },
            ),
            (
                "/income/",
                {
                    "name": "Alquiler recibido",
                    "amount": 500,
                    "category": "Rentas",
                    "frequency": "Mensual",
                    "is_passive": True,
                },
            ),
            (
                "/expense/",
                {
                    "category": "Vivienda",
                    "amount": 1000,
                    "date": "2026-07-01",
                    "description": "Alquiler",
                    "is_essential": True,
                },
            ),
            (
                "/expense/",
                {
                    "category": "Restaurantes",
                    "amount": 300,
                    "date": "2026-06-10",
                    "description": "Comidas",
                    "is_essential": False,
                },
            ),
            (
                "/assets/",
                {
                    "name": "Fondo indexado",
                    "category": "Inversiones",
                    "value": 10000,
                    "classification": "productive",
                },
            ),
            (
                "/liabilities/",
                {
                    "name": "Tarjeta",
                    "category": "Consumo",
                    "balance": 2000,
                    "classification": "bad",
                    "annual_interest_rate": 45,
                },
            ),
            (
                "/mortgages/",
                {
                    "name": "Prestamo personal",
                    "principal": 3000,
                    "credit_type": "Personal",
                    "credit_limit": None,
                    "annual_interest_rate": 0,
                    "term_months": 12,
                    "start_date": "2026-07-01",
                },
            ),
        ]
        for path, payload in records:
            response = self.client.post(path, json=payload, headers=headers)
            self.assertEqual(response.status_code, 201, response.text)

    def test_dashboard_summary_uses_only_current_user_records(self):
        owner_token = self.register_and_login("owner@example.com")
        other_token = self.register_and_login("other@example.com")
        self.create_financial_dataset(owner_token)
        other_income = self.client.post(
            "/income/",
            json={
                "name": "Otro salario",
                "amount": 999,
                "category": "Trabajo",
                "frequency": "Mensual",
                "is_passive": False,
            },
            headers=self.authorization(other_token),
        )
        self.assertEqual(other_income.status_code, 201, other_income.text)

        owner_summary = self.client.get(
            "/dashboard/summary", headers=self.authorization(owner_token)
        )
        other_summary = self.client.get(
            "/dashboard/summary", headers=self.authorization(other_token)
        )

        self.assertEqual(owner_summary.status_code, 200, owner_summary.text)
        self.assertEqual(
            owner_summary.json(),
            {
                "income_total": 5500.0,
                "expense_total": 1300.0,
                "asset_total": 10000.0,
                "liability_total": 5000.0,
                "cash_flow": 4200.0,
                "net_worth": 5000.0,
                "savings_rate": 76.36363636363637,
                "debt_total": 5000.0,
                "debt_ratio": 50.0,
            },
        )
        self.assertEqual(other_summary.json()["income_total"], 999)
        self.assertEqual(other_summary.json()["asset_total"], 0)

    def test_financial_report_filters_and_isolates_users(self):
        owner_token = self.register_and_login("owner@example.com")
        other_token = self.register_and_login("other@example.com")
        self.create_financial_dataset(owner_token)

        report = self.client.get(
            "/reports/financial", headers=self.authorization(owner_token)
        )
        self.assertEqual(report.status_code, 200, report.text)
        body = report.json()
        self.assertEqual(body["summary"]["income_total"], 5500)
        self.assertEqual(body["summary"]["expense_total"], 1300)
        self.assertEqual(body["summary"]["passive_income_total"], 500)
        self.assertEqual(body["summary"]["liability_total"], 5000)
        self.assertEqual(len(body["transactions"]), 4)
        self.assertEqual(body["financial_health"]["productive_assets"], 10000)

        filtered = self.client.get(
            "/reports/financial",
            params={
                "record_type": "expense",
                "date_from": "2026-07-01",
                "date_to": "2026-07-31",
            },
            headers=self.authorization(owner_token),
        )
        self.assertEqual(filtered.status_code, 200, filtered.text)
        self.assertEqual(filtered.json()["summary"]["income_total"], 0)
        self.assertEqual(filtered.json()["summary"]["expense_total"], 1000)
        self.assertEqual(len(filtered.json()["transactions"]), 1)

        invalid_range = self.client.get(
            "/reports/financial",
            params={"date_from": "2026-07-31", "date_to": "2026-07-01"},
            headers=self.authorization(owner_token),
        )
        other_report = self.client.get(
            "/reports/financial", headers=self.authorization(other_token)
        )
        self.assertEqual(invalid_range.status_code, 422)
        self.assertEqual(other_report.json()["summary"]["income_total"], 0)
        self.assertEqual(other_report.json()["transactions"], [])

    def test_report_exports_return_valid_file_signatures(self):
        token = self.register_and_login("owner@example.com")
        self.create_financial_dataset(token)
        headers = self.authorization(token)

        pdf = self.client.get("/reports/export/pdf", headers=headers)
        xlsx = self.client.get("/reports/export/xlsx", headers=headers)
        unsupported = self.client.get("/reports/export/csv", headers=headers)

        self.assertEqual(pdf.status_code, 200, pdf.text)
        self.assertEqual(pdf.headers["content-type"], "application/pdf")
        self.assertTrue(pdf.content.startswith(b"%PDF"))
        self.assertIn("reporte-financial-ai.pdf", pdf.headers["content-disposition"])
        self.assertEqual(xlsx.status_code, 200, xlsx.text)
        self.assertTrue(xlsx.headers["content-type"].startswith("application/vnd"))
        self.assertTrue(xlsx.content.startswith(b"PK"))
        self.assertIn("reporte-financial-ai.xlsx", xlsx.headers["content-disposition"])
        self.assertEqual(unsupported.status_code, 404)

    def test_user_listing_requires_superuser(self):
        regular_token = self.register_and_login("regular@example.com")
        admin_token = self.register_and_login("admin@example.com", "Administradora")

        forbidden = self.client.get(
            "/auth/users", headers=self.authorization(regular_token)
        )
        self.assertEqual(forbidden.status_code, 403)

        with self.session_factory() as db:
            admin = db.query(User).filter(User.email == "admin@example.com").one()
            admin.is_superuser = True
            db.commit()

        allowed = self.client.get(
            "/auth/users", headers=self.authorization(admin_token)
        )
        self.assertEqual(allowed.status_code, 200, allowed.text)
        self.assertEqual(
            {user["email"] for user in allowed.json()},
            {"regular@example.com", "admin@example.com"},
        )


if __name__ == "__main__":
    unittest.main()
