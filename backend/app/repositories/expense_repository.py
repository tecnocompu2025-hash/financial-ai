from sqlalchemy.orm import Session

from app.models.expense import Expense


class ExpenseRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data):

        expense = Expense(
            user_id=user_id,
            **data.model_dump()
        )

        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)

        return expense

    def get_all(self, user_id: int):

        return (
            self.db.query(Expense)
            .filter(Expense.user_id == user_id)
            .order_by(Expense.date.desc())
            .all()
        )

    def get_by_id(self, expense_id: int, user_id: int):

        return (
            self.db.query(Expense)
            .filter(
                Expense.id == expense_id,
                Expense.user_id == user_id,
            )
            .first()
        )

    def update(self, expense: Expense, data):

        values = data.model_dump()

        for key, value in values.items():
            setattr(expense, key, value)

        self.db.commit()
        self.db.refresh(expense)

        return expense

    def delete(self, expense: Expense):

        self.db.delete(expense)
        self.db.commit()