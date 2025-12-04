from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.model_compare import ModelCompareParams, ModelCompareResponse
from app.services.car.compare_service import compare_service

router = APIRouter(prefix="/models", tags=["models-compare"])

@router.post("/compare", response_model=ModelCompareResponse)
def compare_models(params: ModelCompareParams, db: Session = Depends(get_db)):
    return compare_service.compare_models(db, params)
