from fastapi import HTTPException

from app.repositories.expense_repository import ExpenseRepository


class ExpenseService:

    def __init__(self, db):
        self.repository = ExpenseRepository(db)

    def create(self, user_id, expense_data):
        return self.repository.create(
            user_id,
            expense_data,
        )

    def get_all(self, user_id):
        return self.repository.get_all(user_id)

    def get_by_id(self, expense_id, user_id):

        expense = self.repository.get_by_id(
            expense_id,
            user_id,
        )

        if not expense:
            raise HTTPException(
                status_code=404,
                detail="Gasto no encontrado.",
            )

        return expense

    def update(self, expense_id, user_id, expense_data):

        expense = self.get_by_id(
            expense_id,
            user_id,
        )

        return self.repository.update(
            expense,
            expense_data,
        )

    def delete(self, expense_id, user_id):

        expense = self.get_by_id(
            expense_id,
            user_id,
        )

        self.repository.delete(expense)

        return {
            "message": "Gasto eliminado correctamente."
        }