# app/api/routes/model.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.permission import require_admin
from app.services.utils.get_model import get_model_by_id
from app.db.database import get_db
from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate, ModelOut
from app.services.car.model import model_service

router = APIRouter(prefix="/models", tags=["models"])

@router.post("/", response_model=ModelOut)
def create_new_model(
    model_data: ModelCreate,
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_admin)
):
    admin_id = int(current_user_payload.get("sub"))
    
    return model_service.create_model(db=db, user_id=admin_id, model_data=model_data)


@router.patch("/{model_id}", response_model=ModelOut)
def update_model(
    model_id: int,
    update_data: ModelUpdate,
    db: Session = Depends(get_db),
    current_user_payload: dict = Depends(require_admin),
    db_object: Model = Depends(get_model_by_id) 
):
    admin_id = int(current_user_payload.get("sub"))
    
    return model_service.update_model(
        db=db, 
        user_id=admin_id, 
        db_object=db_object, 
        update_data=update_data
    )