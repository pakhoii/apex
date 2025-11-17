from pydantic import BaseModel, EmailStr
# from typing import Optional
from app.models.user import UserRole

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
    is_2fa_enabled: bool
    role: UserRole

    class Config:
        orm_mode = True

# User login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
# User schema with OTP
class OtpVerify(BaseModel):
    otp_code: str
    pending_token: str
    
# User schema for password reset
class UserResetPassword(BaseModel):
    email: EmailStr
    new_password: str
    
# Allow admin create new user
class AdminUserCreate(UserCreate):
    role: UserRole = UserRole.USER