from app.repositories.profile_repository import ProfileRepository


class ProfileService:

    def __init__(self, db):
        self.repository = ProfileRepository(db)

    def create(self, user_id, profile_data):

        profile = self.repository.get_by_user(user_id)

        if profile:
            raise Exception("El perfil ya existe.")

        return self.repository.create(
            user_id,
            profile_data,
        )

    def get_profile(self, user_id):
        return self.repository.get_by_user(user_id)

    def update(self, user_id, profile_data):
        profile = self.repository.get_by_user(user_id)
        if not profile:
            raise ValueError("El perfil no existe.")
        return self.repository.update(profile, profile_data)
