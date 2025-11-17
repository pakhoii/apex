from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.permission import require_admin
from app.db.database import get_db
from app.schemas.user import AdminUserCreate, UserOut
from app.services.auth.register import register_service

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/users/", response_model=UserOut)
def create_user_by_admin(
    user_data: AdminUserCreate,
    db: Session = Depends(get_db),
    # Must be admin for this endpoints
    current_admin_payload: dict = Depends(require_admin) 
):
    """
    Admin create new user and set their role
    """
    new_user = register_service.create_user_as_admin(db, user_data)
    return new_user