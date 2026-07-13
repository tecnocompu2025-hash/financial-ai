from datetime import date
from sqlalchemy import Date, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base

class CreditPayment(Base):
    __tablename__ = "credit_payments"
    id: Mapped[int] = mapped_column(primary_key=True)
    mortgage_id: Mapped[int] = mapped_column(ForeignKey("mortgages.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    interest_amount: Mapped[float] = mapped_column(Float, nullable=False)
    principal_amount: Mapped[float] = mapped_column(Float, nullable=False)
    paid_date: Mapped[date] = mapped_column(Date, nullable=False)
