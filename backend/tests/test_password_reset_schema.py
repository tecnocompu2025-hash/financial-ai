import unittest

from pydantic import ValidationError

from app.schemas.user import PasswordResetConfirm


class PasswordResetSchemaTests(unittest.TestCase):
    def test_password_reset_requires_letters_numbers_and_confirmation(self):
        with self.assertRaises(ValidationError):
            PasswordResetConfirm(token="a" * 20, new_password="abcdefgh", confirm_password="abcdefgh")
        with self.assertRaises(ValidationError):
            PasswordResetConfirm(token="a" * 20, new_password="Secure123", confirm_password="Different123")

        valid = PasswordResetConfirm(token="a" * 20, new_password="Secure123", confirm_password="Secure123")
        self.assertEqual(valid.new_password, "Secure123")
