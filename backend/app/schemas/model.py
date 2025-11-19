from pydantic import BaseModel, HttpUrl
from typing import Optional

class ModelBase(BaseModel):
    name: str
    price: int
    year: int
    amount: int
    image_url: Optional[HttpUrl] = None
    brand_id: int


# Add nothing, same schema with the ModelBase
class ModelCreate(ModelBase): 
    pass


class ModelUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    year: Optional[int] = None
    amount: Optional[int] = None
    image_url: Optional[HttpUrl] = None
    brand_id: Optional[int] = None


class ModelOut(ModelBase):
    id: int
    class Config: orm_mode = True