import unittest
from types import SimpleNamespace
from unittest.mock import patch

from app.services.auth_service import AuthService


class FakeUser:
    id = 1
    email = "user@example.com"


class FakeRepository:
    def __init__(self, user=None):
        self.user = user

    def get_by_email(self, email):
        return self.user if email == "user@example.com" else None


class FakeDatabase:
    def add(self, value):
        self.value = value

    def commit(self):
        pass


class PasswordResetServiceTests(unittest.TestCase):
    def test_missing_smtp_returns_the_same_neutral_message(self):
        settings = SimpleNamespace(SMTP_HOST=None, SMTP_USER=None, SMTP_PASSWORD=None, SMTP_FROM=None)
        with patch("app.services.auth_service.settings", settings):
            existing = AuthService(FakeDatabase())
            existing.repository = FakeRepository(FakeUser())
            missing = AuthService(FakeDatabase())
            missing.repository = FakeRepository()
            self.assertEqual(existing.request_password_reset("user@example.com"), missing.request_password_reset("missing@example.com"))
