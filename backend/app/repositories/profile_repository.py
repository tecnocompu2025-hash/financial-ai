from sqlalchemy.orm import Session

from app.models.profile import Profile


class ProfileRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data):

        profile = Profile(
            user_id=user_id,
            **data.dict()
        )

        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)

        return profile

    def get_by_user(self, user_id: int):

        return (
            self.db.query(Profile)
            .filter(Profile.user_id == user_id)
            .first()
        )