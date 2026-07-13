from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class Income(Base):
    __tablename__ = "incomes"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(String(100))

    amount: Mapped[float] = mapped_column(Float)

    category: Mapped[str] = mapped_column(String(50))

    frequency: Mapped[str] = mapped_column(String(30))

    is_passive: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
    )
