from fastapi import HTTPException

from app.repositories.asset_repository import AssetRepository


class AssetService:
    def __init__(self, db):
        self.repository = AssetRepository(db)

    def create(self, user_id: int, data):
        return self.repository.create(user_id, data)

    def get_all(self, user_id: int):
        return self.repository.get_all(user_id)

    def update(self, asset_id: int, user_id: int, data):
        asset = self._get(asset_id, user_id)
        return self.repository.update(asset, data)

    def delete(self, asset_id: int, user_id: int):
        asset = self._get(asset_id, user_id)
        self.repository.delete(asset)
        return {"message": "Activo eliminado correctamente"}

    def _get(self, asset_id: int, user_id: int):
        asset = self.repository.get_by_id(asset_id, user_id)
        if not asset:
            raise HTTPException(status_code=404, detail="Activo no encontrado")
        return asset
