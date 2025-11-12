from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

import jwt
from app.core.config import settings

class TokenService:
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM
        self.access_token_expire_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        self.refresh_token_expire_delta = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        self.pending_auth_token_expire_delta = timedelta(minutes=settings.PENDING_AUTH_TOKEN_EXPIRE_MINUTES)

    def _create_token(self, data: dict, expires_delta: timedelta, token_type: str) -> str:
        """
        Create token method
        """
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc), # Issued at time
            "type": token_type # Thêm loại token để phân biệt
        })
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_access_token(self, data: Dict[str, Any]) -> str:
        """Create access token"""
        return self._create_token(
            data=data, 
            expires_delta=self.access_token_expire_delta,
            token_type="access"
        )

    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Create refresh token"""
        return self._create_token(
            data=data, 
            expires_delta=self.refresh_token_expire_delta,
            token_type="refresh"
        )

    def create_pending_auth_token(self, user_id: str) -> str:
        """Create pending token for 2FA process"""
        data = {"sub": user_id}
        return self._create_token(
            data=data,
            expires_delta=self.pending_auth_token_expire_delta,
            token_type="pending_auth"
        )

    def decode_token(self, token: str) -> Optional[dict]:
        """
        Decode the token and return payload if it is valid
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.PyJWTError:
            # Có thể log lỗi ở đây nếu cần (e.g., jwt.ExpiredSignatureError, jwt.InvalidTokenError)
            return None

    def decode_pending_auth_token(self, token: str) -> Optional[dict]:
        """
        Decode and verify pending token
        """
        payload = self.decode_token(token)
        # Kiểm tra thêm xem có đúng là token "pending_auth" không
        if payload and payload.get("type") == "pending_auth":
            return payload
        return None

# Tạo một instance duy nhất để import và sử dụng ở nơi khác
token_service = TokenService()