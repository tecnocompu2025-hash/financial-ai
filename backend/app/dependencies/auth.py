from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        user_id = int(payload.get("sub"))

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido",
        )

    repository = UserRepository(db)

    user = repository.get_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Usuario no encontrado",
        )

    return user