from sqlalchemy.orm import Session
from app.models.goal import Goal

class GoalRepository:
    def __init__(self, db: Session): self.db = db
    def create(self, user_id, data):
        item = Goal(user_id=user_id, **data.model_dump()); self.db.add(item); self.db.commit(); self.db.refresh(item); return item
    def get_all(self, user_id): return self.db.query(Goal).filter(Goal.user_id == user_id).order_by(Goal.id.desc()).all()
    def get_by_id(self, item_id, user_id): return self.db.query(Goal).filter(Goal.id == item_id, Goal.user_id == user_id).first()
    def update(self, item, data):
        for key, value in data.model_dump().items(): setattr(item, key, value)
        self.db.commit(); self.db.refresh(item); return item
    def delete(self, item): self.db.delete(item); self.db.commit()
