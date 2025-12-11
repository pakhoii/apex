from pydantic import BaseModel, HttpUrl
from typing import Optional

class BrandBase(BaseModel):
    name: str
    
    
class BrandCreate(BrandBase):
    logo_url: Optional[HttpUrl] = None
    

class BrandUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None


class BrandOut(BrandBase):
    id: int
    logo_url: Optional[HttpUrl] = None
    
    class Config:
        from_attributes = True