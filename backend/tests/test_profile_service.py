import unittest
from types import SimpleNamespace

from app.services.profile_service import ProfileService


class FakeProfileRepository:
    def __init__(self, profile=None):
        self.profile = profile

    def get_by_user(self, user_id):
        return self.profile

    def update(self, profile, data):
        for field, value in data.model_dump().items():
            setattr(profile, field, value)
        return profile


class FakeProfileData:
    def model_dump(self):
        return {"country": "Peru", "currency": "PEN"}


class ProfileServiceTests(unittest.TestCase):
    def test_update_changes_own_profile(self):
        profile = SimpleNamespace(country="Chile", currency="CLP")
        service = ProfileService(None)
        service.repository = FakeProfileRepository(profile)
        updated = service.update(1, FakeProfileData())
        self.assertEqual(updated.country, "Peru")
        self.assertEqual(updated.currency, "PEN")

    def test_update_rejects_missing_profile(self):
        service = ProfileService(None)
        service.repository = FakeProfileRepository()
        with self.assertRaises(ValueError):
            service.update(1, FakeProfileData())
