from fastapi import APIRouter, Depends
from app.db.database import get_db
from app.schemas.user import UserCreate
from app.schemas.token import Token
from sqlalchemy.orm import Session
from app.services.auth.register import create_user
from app.services.auth.token import create_token_access

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
) -> Token:
    """
    Register a new user and return an access token.

    Args:
        user_data (UserCreate): The user data for registration.
        db (Session): The database session.

    Returns:
        Token: The access token for the newly registered user.
    """
    new_user = create_user(db, user_data)
    access_token = create_token_access(data={"sub": new_user.id})
    return Token(access_token=access_token, token_type="bearer")
