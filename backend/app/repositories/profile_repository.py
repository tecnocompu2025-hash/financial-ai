from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.profile import Profile


class ProfileRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data):
        try:
            profile = Profile(
                user_id=user_id,
                **data.model_dump()
            )
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)
            return profile
        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_by_user(self, user_id: int):

        return (
            self.db.query(Profile)
            .filter(Profile.user_id == user_id)
            .first()
        )

    def update(self, profile: Profile, data):
        for field, value in data.model_dump().items():
            setattr(profile, field, value)
        self.db.commit()
        self.db.refresh(profile)
        return profile
