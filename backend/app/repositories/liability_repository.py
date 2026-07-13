from sqlalchemy.orm import Session

from app.models.liability import Liability


class LiabilityRepository:
    def __init__(self, db: Session): self.db = db
    def create(self, user_id, data):
        item = Liability(user_id=user_id, **data.model_dump()); self.db.add(item); self.db.commit(); self.db.refresh(item); return item
    def get_all(self, user_id): return self.db.query(Liability).filter(Liability.user_id == user_id).order_by(Liability.id.desc()).all()
    def get_by_id(self, item_id, user_id): return self.db.query(Liability).filter(Liability.id == item_id, Liability.user_id == user_id).first()
    def delete(self, item): self.db.delete(item); self.db.commit()
    def update(self, item, data):
        for key, value in data.model_dump().items(): setattr(item, key, value)
        self.db.commit(); self.db.refresh(item); return item
