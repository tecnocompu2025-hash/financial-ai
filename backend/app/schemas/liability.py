from pydantic import BaseModel, ConfigDict, Field
class LiabilityCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    balance: float = Field(gt=0)
    classification: str = Field(default="bad", pattern="^(good|bad)$")
    annual_interest_rate: float = Field(default=0, ge=0, le=1000)
class LiabilityResponse(LiabilityCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
