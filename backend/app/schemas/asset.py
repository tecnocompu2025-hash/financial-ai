from pydantic import BaseModel, ConfigDict, Field


class AssetCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    value: float = Field(gt=0)
    classification: str = Field(default="non_productive", pattern="^(productive|non_productive)$")


class AssetResponse(AssetCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
