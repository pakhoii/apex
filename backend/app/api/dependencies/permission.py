from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.services.auth.token import token_service
from app.models.user import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = [role.value for role in allowed_roles]

    def __call__(self, token: str = Depends(oauth2_scheme)) -> dict:
        payload = token_service.decode_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type, require 'access' token",
            )
            
        user_role = payload.get("role")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this resource",
            )
        return payload

require_admin = RoleChecker([UserRole.ADMIN])
require_user = RoleChecker([UserRole.USER])
require_any_logged_in_user = RoleChecker([UserRole.USER, UserRole.ADMIN])