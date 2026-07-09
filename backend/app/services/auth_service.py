from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.security.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register(
        self,
        name: str,
        email: str,
        password: str,
    ):

        user = self.repository.get_by_email(email)

        if user:
            raise Exception("El usuario ya existe.")

        password_hash = hash_password(password)

        return self.repository.create(
            name,
            email,
            password_hash,
        )

    def login(
        self,
        email: str,
        password: str,
    ):

        user = self.repository.get_by_email(email)

        if not user:
            return None

        if not verify_password(
            password,
            user.password,
        ):
            return None

        token = create_access_token(
            {
                "sub": str(user.id)
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }