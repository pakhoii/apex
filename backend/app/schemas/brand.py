from pydantic import BaseModel, HttpUrl
from typing import Optional

class BrandBase(BaseModel):
    name: str
    logo_url: Optional[HttpUrl] = None
    
    
class BrandCreate(BrandBase):
    pass


class BrandUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None


class BrandOut(BrandBase):
    id: int
    
    class Config:
        orm_mode = True