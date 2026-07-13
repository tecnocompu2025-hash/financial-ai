from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from hashlib import sha256
import secrets
import smtplib
from email.message import EmailMessage

from app.repositories.user_repository import UserRepository
from app.security.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from fastapi import HTTPException
from app.core.config import settings
from app.models.password_reset_token import PasswordResetToken


class AuthService:

    def __init__(self, db: Session):
        self.db = db
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

    def change_password(self, user, current_password: str, new_password: str):
        if not verify_password(current_password, user.password):
            raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
        self.repository.update_password(user, hash_password(new_password))
        return {"message": "Contraseña actualizada correctamente. Inicia sesión nuevamente."}

    def request_password_reset(self, email: str):
        user = self.repository.get_by_email(email)
        if not user: return {"message": "Si el correo existe, recibirás un enlace de recuperación."}
        raw_token = secrets.token_urlsafe(32)
        self.db.add(PasswordResetToken(user_id=user.id, token_hash=sha256(raw_token.encode()).hexdigest(), expires_at=datetime.utcnow() + timedelta(minutes=30)))
        self.db.commit()
        if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.SMTP_PASSWORD, settings.SMTP_FROM]):
            raise HTTPException(status_code=503, detail="El correo de recuperación no está configurado")
        message = EmailMessage(); message["Subject"] = "Recupera tu contraseña de Financial AI"; message["From"] = settings.SMTP_FROM; message["To"] = user.email
        message.set_content(f"Abre este enlace para restablecer tu contraseña: {settings.FRONTEND_URL}/reset-password?token={raw_token}\nEl enlace vence en 30 minutos.")
        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls(); server.login(settings.SMTP_USER, settings.SMTP_PASSWORD); server.send_message(message)
        except (OSError, smtplib.SMTPException) as error:
            raise HTTPException(status_code=503, detail="No se pudo enviar el correo de recuperación") from error
        return {"message": "Si el correo existe, recibirás un enlace de recuperación."}

    def reset_password(self, token: str, new_password: str):
        token_hash = sha256(token.encode()).hexdigest()
        item = self.db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash, PasswordResetToken.used == False, PasswordResetToken.expires_at > datetime.utcnow()).first()
        if not item: raise HTTPException(status_code=400, detail="El enlace es inválido o venció")
        user = self.repository.get_by_id(item.user_id); self.repository.update_password(user, hash_password(new_password)); item.used = True; self.db.commit()
        return {"message": "Contraseña restablecida correctamente."}
