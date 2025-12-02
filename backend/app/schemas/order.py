from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Annotated
from app.core.enums import OrderAction, OrderStatus

class OrderItemCreate(BaseModel):
    model_id: int
    quantity: int
    unit_price: int
    

class OrderCreate(BaseModel):
    shipping_address: str
    items: Annotated[List[OrderItemCreate], Field(min_length=1)]
    

class OrderUpdate(BaseModel): 
    pass    


class OrderItemOut(BaseModel):
    model_id: int
    quantity: int
    unit_price: int
    
    class Config: 
        from_attributes = True
        
class OrderOut(BaseModel):
    id: int
    user_id: int
    shipping_address: str
    order_date: datetime
    status: OrderStatus
    items: List[OrderItemOut]
    
    class Config:
        from_attributes = True
        

class OrderTransitionRequest(BaseModel):
    action: OrderAction