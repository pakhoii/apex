from pydantic import BaseModel, Field, validator
from typing import List, Any
from app.schemas.model import ModelOut

class ModelCompareParams(BaseModel):
    ids: List[int]

    @validator('ids')
    def validate_ids(cls, v):
        if not (2 <= len(v) <= 5):
            raise ValueError('Must compare between 2 and 5 models')
        if len(v) != len(set(v)):
            raise ValueError('All model IDs must be unique')
        return v

class ModelCompareValue(BaseModel):
    model_id: int
    model_name: str
    value: Any

class ModelComparison(BaseModel):
    field: str
    values: List[ModelCompareValue]

class ModelCompareResponse(BaseModel):
    models: List[ModelOut]
    comparisons: List[ModelComparison]
