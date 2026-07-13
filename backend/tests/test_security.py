import unittest
from fastapi import HTTPException

from app.security.security import hash_password, verify_password
from app.dependencies.auth import get_current_superuser


class SecurityTests(unittest.TestCase):
    def test_password_is_hashed_and_verifiable(self):
        hashed = hash_password("clave-segura-de-prueba")
        self.assertNotEqual(hashed, "clave-segura-de-prueba")
        self.assertTrue(verify_password("clave-segura-de-prueba", hashed))
        self.assertFalse(verify_password("clave-incorrecta", hashed))

    def test_non_superuser_cannot_access_administration(self):
        with self.assertRaises(HTTPException) as context:
            get_current_superuser(type("User", (), {"is_superuser": False})())
        self.assertEqual(context.exception.status_code, 403)
