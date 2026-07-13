from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.profile import Profile


class ProfileRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data):

        try:
            print("========== INICIO CREATE PROFILE ==========")

            profile = Profile(
                user_id=user_id,
                **data.model_dump()
            )

            print("✅ PASO 1 - Objeto Profile creado")

            self.db.add(profile)

            print("✅ PASO 2 - Agregado a la sesión")

            self.db.commit()

            print("✅ PASO 3 - Commit realizado")

            self.db.refresh(profile)

            print("✅ PASO 4 - Refresh realizado")

            print("========== FIN CREATE PROFILE ==========")

            return profile

        except SQLAlchemyError as e:
            self.db.rollback()

            print("\n=============================")
            print("ERROR SQLALCHEMY")
            print(type(e).__name__)
            print(str(e))
            print("=============================\n")

            raise

        except Exception as e:
            self.db.rollback()

            print("\n=============================")
            print("ERROR GENERAL")
            print(type(e).__name__)
            print(str(e))
            print("=============================\n")

            raise

    def get_by_user(self, user_id: int):

        return (
            self.db.query(Profile)
            .filter(Profile.user_id == user_id)
            .first()
        )
