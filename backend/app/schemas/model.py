from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List

class ModelBase(BaseModel):
    name: str
    price: int
    year: int
    amount: int
    brand_id: int


# Add nothing, same schema with the ModelBase
class ModelCreate(ModelBase): 
    image_url: Optional[HttpUrl] = None


class ModelUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    year: Optional[int] = None
    amount: Optional[int] = None
    image_url: Optional[HttpUrl] = None
    brand_id: Optional[int] = None


class ModelOut(ModelBase):
    id: int
    image_url: Optional[HttpUrl] = None
    
    model_config = {
        "from_attributes": True
    }
    
    
# Schema to get the parameters from filter
class ModelFilterParams(BaseModel):
    search: Optional[str] = None
    brand_id: Optional[int] = None
    min_price: Optional[int] = Field(None, ge=0) 
    max_price: Optional[int] = Field(None, ge=0)
    min_year: Optional[int] = Field(None, ge=1900) 
    max_year: Optional[int] = Field(None, ge=1900)
    # ge=a This field must take in the value that > a
    # First parameter of Field is the default value
    

# Schema for pagination
class PaginationParams(BaseModel):
    # Max element from query is 100
    skip: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100) 
    

# Schema for response
class PagedModelResponse(BaseModel):
    rows: List[ModelOut]
    total: int
    page: int
    limit: int
    total_pages: int
    

