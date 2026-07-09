from datetime import date

from sqlalchemy import ForeignKey, String, Date, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class Income(Base):
    __tablename__ = "incomes"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    source: Mapped[str] = mapped_column(String(100))

    amount: Mapped[float] = mapped_column(Float)

    date: Mapped[date] = mapped_column(Date)

    description: Mapped[str] = mapped_column(
        String(250)
    )