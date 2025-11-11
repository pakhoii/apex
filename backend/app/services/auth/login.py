from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy.orm.session import Session
from typing import Union

from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserLogin, OtpVerify

from app.services.auth.otp import otp_service
from app.services.mail.mail import mail_service
from app.services.auth.token import token_service
from app.services.utils.get_user import get_user_by_email
from app.services.utils.verify_password import verify_password

class LoginService:
    def authenticate_user(self, db: Session, email: str, password: str) -> User:
        user = get_user_by_email(db, email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    
    async def login_user(self, db: Session, user_data: UserLogin, background_tasks: BackgroundTasks) -> Union[dict, Token]:
        user = self.authenticate_user(db, user_data.email, user_data.password)
        
        if user.is_2fa_enabled:
            otp_code = await otp_service.create_otp(str(user.id))
            background_tasks.add_task(
                mail_service.send_otp_email,
                user.email,
                otp_code
            )
            
            pending_token = token_service.create_pending_auth_token(user_id=str(user.id))
            
            return {
                "status": "otp_required", 
                "message": "OTP sent to your email", 
                "pending_token": pending_token
            }
        else: 
            access_token = token_service.create_access_token(data={"sub": str(user.id)})
            refresh_token = token_service.create_refresh_token(data={"sub": str(user.id)})
            return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")
        
    
    async def verify_login_otp(self, otp_data: OtpVerify) -> Token:
        """
        Verify OTP and give login token
        """
        # Get user_id using thr pending token
        payload = token_service.decode_pending_auth_token(otp_data.pending_token)
        if not payload or "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid or expired token"
            )
            
        user_id = payload.get("sub")
        
        #  Verify OTP
        is_valid = await otp_service.verify_otp(user_id=user_id, otp_code=otp_data.otp_code)
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid OTP"
            )
            
        # Return token if the OTP is valid
        access_token = token_service.create_access_token(data={"sub": user_id})
        refresh_token = token_service.create_refresh_token(data={"sub": user_id})
        
        return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

login_service = LoginService()
