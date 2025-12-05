from pydantic import BaseModel
from typing import List

class CartItemBase(BaseModel):
    model_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemOut(CartItemBase):
    unit_price: int

    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    user_id: int
    items: List[CartItemOut] = []

    class Config:
        from_attributes = True

class CartCreate(BaseModel):
    user_id: int

class CartUpdate(BaseModel):
    pass