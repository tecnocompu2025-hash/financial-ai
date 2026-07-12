from pydantic import BaseModel, ConfigDict, Field
class GoalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(ge=0, default=0)
class GoalResponse(GoalCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
