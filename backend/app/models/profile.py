from sqlalchemy import String, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
    )

    country: Mapped[str] = mapped_column(String(100))
    currency: Mapped[str] = mapped_column(String(10))

    age: Mapped[int] = mapped_column(Integer)

    marital_status: Mapped[str] = mapped_column(String(50))

    children: Mapped[int] = mapped_column(Integer)

    retirement_age: Mapped[int] = mapped_column(Integer)

    financial_goal: Mapped[str] = mapped_column(String(255))

    monthly_salary: Mapped[float] = mapped_column(Float)

    custom_exchange_rate: Mapped[float] = mapped_column(Float, nullable=True)

    donation_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    
    quality_of_life_percentage: Mapped[float] = mapped_column(Float, default=0.0)