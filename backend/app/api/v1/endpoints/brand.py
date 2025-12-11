from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session

from typing import Optional

from app.api.dependencies.permission import require_admin
from app.services.utils.get_brand import get_brand_by_id

from app.db.database import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate, BrandOut
from app.services.car.brand import brand_service


router = APIRouter(prefix="/brands", tags=["brands"])

@router.post("/", response_model=BrandOut)
def create_new_brand (
    name: str = Form(...),
    logo_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_admin)
): 
    admin_id = int(current_user_payload.get("sub"))
    
    brand_data = BrandCreate(name=name)
    
    return brand_service.create_brand(
        db=db, 
        user_id=admin_id, 
        brand_data=brand_data,
        logo_file=logo_file
    )


@router.patch("/{brand_id}", response_model=BrandOut)
async def update_brand(
    brand_id: int,
    name: Optional[str] = Form(None),
    logo_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_admin),
    brand_to_update: Brand = Depends(get_brand_by_id)
):
    admin_id = int(current_user_payload.get("sub"))
    
    # Create update data object
    update_data = BrandUpdate(name=name)
    
    return brand_service.update_brand(
        db=db, 
        user_id=admin_id, 
        db_object=brand_to_update,
        update_data=update_data,
        logo_file=logo_file
    )