from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.permission import require_admin
from app.services.utils.get_brand import get_brand_by_id

from app.db.database import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate, BrandOut
from app.services.car.brand import brand_service


router = APIRouter(prefix="/brands", tags=["brands"])

@router.post("/", response_model=BrandOut)
def create_new_brand (
    brand_data: BrandCreate,
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_admin)
): 
    admin_id = int(current_user_payload.get("sub"))
    return brand_service.create_brand(db=db, user_id=admin_id, brand_data=brand_data)


@router.patch("/{brand_id}/update", response_model=BrandOut)
def update_brand(
    brand_id: int,
    update_data: BrandUpdate,
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_admin),
    brand_to_update: Brand = Depends(get_brand_by_id)
):
    admin_id = int(current_user_payload.get("sub"))
    return brand_service.update_brand(
        db=db, 
        user_id=admin_id, 
        db_object=brand_to_update,
        update_data=update_data
    )