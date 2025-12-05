# app/api/routes/model.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.permission import require_admin
from app.services.utils.get_model import get_model_by_id
from app.db.database import get_db
from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate, ModelOut, PagedModelResponse, ModelFilterParams, PaginationParams
from app.services.car.model import model_service
from app.services.car.filter_service import filter_service

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
    
@router.get("/", response_model=PagedModelResponse)
def get_model_list(
    db: Session = Depends(get_db),
    
    # Depends() acts like an "automatic data collector" or a personal assistant:
    # 1. It looks at the URL parameters sent by the user.
    #    Example URL: .../models/?search=Toyota&min_price=50000&page=1
    # 2. It automatically grabs the relevant values (like 'search', 'min_price').
    # 3. It bundles them neatly into the 'filters' variable so you don't have to parse the URL manually.
    filters: ModelFilterParams = Depends(),
    
    # Similarly, this automatically finds pagination details (like 'skip' or 'limit') 
    # in the URL and bundles them into the 'pagination' variable.
    pagination: PaginationParams = Depends()
):
    return filter_service.list_cars(db=db, filters=filters, pagination=pagination)


# Get the details information of a model
@router.get("/{model_id}", response_model=ModelOut)
def get_model_details(
    model_id: int,
    db_object: Model = Depends(get_model_by_id)
):
    return db_object