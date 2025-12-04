from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session

# Import các schema cần thiết cho request body và response model
from app.schemas.token import Token, RefreshTokenRequest
from app.schemas.user import UserLogin, OtpVerify

# Chỉ import auth_service từ lớp service
from app.services.auth.login import login_service
from app.db.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", summary="User Login")
async def login(
    user_data: UserLogin, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    """
    Handles user login.
    - If 2FA is disabled, returns access and refresh tokens.
    - If 2FA is enabled, sends an OTP and returns a pending token.
    """
    return await login_service.login_user(
        db=db, 
        user_data=user_data, 
        background_tasks=background_tasks
    )


@router.post("/login/verify-otp", response_model=Token, summary="Verify 2FA OTP")
async def verify_otp_login(otp_data: OtpVerify):
    """
    Verifies the OTP for 2FA login and returns final tokens upon success.
    """
    return await login_service.verify_login_otp(otp_data=otp_data)


@router.post("/refresh-token", response_model=Token, summary="Refresh Access Token")
async def refresh_token(token_data: RefreshTokenRequest):
    """
    Provides a new access token and a new refresh token using a valid refresh token.
    """
    return await login_service.refresh_access_token(token_data=token_data)