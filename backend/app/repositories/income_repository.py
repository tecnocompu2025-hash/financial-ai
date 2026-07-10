from sqlalchemy.orm import Session

from app.models.income import Income


class IncomeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data):

        income = Income(
            user_id=user_id,
            **data.model_dump()
        )

        self.db.add(income)
        self.db.commit()
        self.db.refresh(income)

        return income

    def get_all(self, user_id: int):

        return (
            self.db.query(Income)
            .filter(Income.user_id == user_id)
            .order_by(Income.created_at.desc())
            .all()
        )

    def get_by_id(self, income_id: int, user_id: int):

        return (
            self.db.query(Income)
            .filter(
                Income.id == income_id,
                Income.user_id == user_id,
            )
            .first()
        )

    def update(self, income: Income, data):

        values = data.model_dump()

        for key, value in values.items():
            setattr(income, key, value)

        self.db.commit()
        self.db.refresh(income)

        return income

    def delete(self, income: Income):

        self.db.delete(income)
        self.db.commit()