from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.user import User


def main():
    db: Session = SessionLocal()

    try:
        users = db.query(User).all()

        if not users:
            print("No hay usuarios registrados.")
            return

        print("\n===== USUARIOS REGISTRADOS =====\n")

        for user in users:
            print(f"ID: {user.id}")
            print(f"Nombre: {user.name}")
            print(f"Email: {user.email}")
            print("-" * 40)

    finally:
        db.close()


if __name__ == "__main__":
    main()