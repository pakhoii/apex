from sqlalchemy.orm.session import Session
from app.models.user import User
from fastapi import HTTPException, status

def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Get a user by email from the database.

    Args:
        db (Session): The database session.
        email (str): The email of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """
    return db.query(User).filter(User.email == email).first()


def get_user_by_phone(db: Session, phone_number: str) -> User | None:
    """
    Get a user by phone number from the database.

    Args:
        db (Session): The database session.
        phone_number (str): The phone number of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """
    return db.query(User).filter(User.phone_number == phone_number).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """
    Get a user by ID from the database.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )
    return user