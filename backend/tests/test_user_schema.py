import unittest

from pydantic import ValidationError

from app.schemas.user import UserRegister


class UserSchemaTests(unittest.TestCase):
    def test_registration_requires_a_secure_password(self):
        with self.assertRaises(ValidationError):
            UserRegister(name="Usuario", email="user@example.com", password="abcdefgh")
        with self.assertRaises(ValidationError):
            UserRegister(name="U", email="user@example.com", password="Secure123")

    def test_registration_accepts_a_secure_password(self):
        user = UserRegister(name="Usuario", email="user@example.com", password="Secure123")
        self.assertEqual(user.email, "user@example.com")
