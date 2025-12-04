from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.crud import crud_brand
from app.models.brand import Brand

def get_brand_by_id(
    brand_id: int,
    db: Session = Depends(get_db)
) -> Brand:
    brand = crud_brand.get(db, id=brand_id)
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Brand with id {brand_id} not found"
        )
    return brand