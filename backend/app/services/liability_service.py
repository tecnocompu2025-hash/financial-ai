from fastapi import HTTPException
from app.repositories.liability_repository import LiabilityRepository

class LiabilityService:
    def __init__(self, db): self.repository = LiabilityRepository(db)
    def create(self, user_id, data): return self.repository.create(user_id, data)
    def get_all(self, user_id): return self.repository.get_all(user_id)
    def update(self, item_id, user_id, data):
        return self.repository.update(self._get(item_id, user_id), data)
    def delete(self, item_id, user_id):
        item = self._get(item_id, user_id)
        self.repository.delete(item); return {"message": "Deuda eliminada correctamente"}
    def _get(self, item_id, user_id):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Deuda no encontrada")
        return item
