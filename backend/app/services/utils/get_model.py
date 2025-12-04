from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.crud import crud_model
from app.models.model import Model

def get_model_by_id(
    model_id: int,
    db: Session = Depends(get_db)
) -> Model:
    model = crud_model.get(db, id=model_id)
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with id {model_id} not found"
        )
    return model