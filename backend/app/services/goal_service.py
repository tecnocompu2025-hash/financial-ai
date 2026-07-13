from fastapi import HTTPException
from app.repositories.goal_repository import GoalRepository

class GoalService:
    def __init__(self, db): self.repository = GoalRepository(db)
    def create(self, user_id, data): return self.repository.create(user_id, data)
    def get_all(self, user_id): return self.repository.get_all(user_id)
    def update(self, item_id, user_id, data):
        item = self._get(item_id, user_id); return self.repository.update(item, data)
    def delete(self, item_id, user_id):
        item = self._get(item_id, user_id); self.repository.delete(item); return {"message": "Meta eliminada"}
    def _get(self, item_id, user_id):
        item = self.repository.get_by_id(item_id, user_id)
        if not item: raise HTTPException(status_code=404, detail="Meta no encontrada")
        return item
