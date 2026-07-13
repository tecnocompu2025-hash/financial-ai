from sqlalchemy.orm import Session

from app.models.asset import Asset


class AssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data):
        asset = Asset(user_id=user_id, **data.model_dump())
        self.db.add(asset)
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def get_all(self, user_id: int):
        return self.db.query(Asset).filter(Asset.user_id == user_id).order_by(Asset.id.desc()).all()

    def get_by_id(self, asset_id: int, user_id: int):
        return self.db.query(Asset).filter(Asset.id == asset_id, Asset.user_id == user_id).first()

    def delete(self, asset: Asset):
        self.db.delete(asset)
        self.db.commit()

    def update(self, asset: Asset, data):
        for key, value in data.model_dump().items():
            setattr(asset, key, value)
        self.db.commit()
        self.db.refresh(asset)
        return asset
