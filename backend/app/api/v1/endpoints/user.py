from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.api.dependencies.permission import require_admin, require_any_logged_in_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdateMe, UserRoleUpdate
from app.services.user.user import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_my_information(
    current_user: User = Depends(deps.get_current_user),
):
    return current_user


@router.put("/me", response_model=UserOut)
def update_my_information(
    user_update: UserUpdateMe,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return user_service.update_user_info(db, user_id=current_user.id, user_update=user_update)


@router.put("/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_admin_payload: dict = Depends(require_admin),
):
    return user_service.update_user_role(db, user_id=user_id, role_update=role_update)