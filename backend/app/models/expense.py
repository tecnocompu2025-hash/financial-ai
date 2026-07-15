from datetime import date

from sqlalchemy import Boolean, Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    category: Mapped[str] = mapped_column(String(100))

    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default='PEN')

    date: Mapped[date] = mapped_column(Date)

    description: Mapped[str] = mapped_column(
        String(250)
    )

    is_essential: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
