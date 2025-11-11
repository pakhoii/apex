from pydantic import BaseModel, EmailStr
# from typing import Optional

# Base user schema
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str

# Use for user creation
class UserCreate(UserBase):
    password: str
    
# Use for user update
class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    password: str | None = None

# Use for user output
class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True
