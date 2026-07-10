from fastapi import HTTPException

from app.repositories.income_repository import IncomeRepository


class IncomeService:

    def __init__(self, db):
        self.repository = IncomeRepository(db)

    def create(self, user_id, income_data):
        return self.repository.create(
            user_id,
            income_data,
        )

    def get_all(self, user_id):
        return self.repository.get_all(user_id)

    def get_by_id(self, income_id, user_id):

        income = self.repository.get_by_id(
            income_id,
            user_id,
        )

        if not income:
            raise HTTPException(
                status_code=404,
                detail="Ingreso no encontrado.",
            )

        return income

    def update(self, income_id, user_id, income_data):

        income = self.get_by_id(
            income_id,
            user_id,
        )

        return self.repository.update(
            income,
            income_data,
        )

    def delete(self, income_id, user_id):

        income = self.get_by_id(
            income_id,
            user_id,
        )

        self.repository.delete(income)

        return {
            "message": "Ingreso eliminado correctamente."
        }