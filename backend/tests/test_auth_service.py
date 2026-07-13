import unittest

from app.services.auth_service import AuthService
from app.security.security import verify_password


class FakeUser:
    def __init__(self, email, password): self.id = 1; self.email = email; self.password = password


class FakeRepository:
    def __init__(self): self.users = {}
    def get_by_email(self, email): return self.users.get(email)
    def create(self, name, email, password):
        user = FakeUser(email, password); self.users[email] = user; return user


class AuthServiceTests(unittest.TestCase):
    def setUp(self):
        self.service = AuthService(None)
        self.service.repository = FakeRepository()

    def test_register_hashes_the_password(self):
        user = self.service.register("Usuario", "user@example.com", "ClavePrueba123")
        self.assertNotEqual(user.password, "ClavePrueba123")
        self.assertTrue(verify_password("ClavePrueba123", user.password))

    def test_duplicate_email_is_rejected(self):
        self.service.register("Usuario", "user@example.com", "ClavePrueba123")
        with self.assertRaises(Exception):
            self.service.register("Otro", "user@example.com", "OtraClave123")
