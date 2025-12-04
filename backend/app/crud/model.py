from typing import List, Tuple
from sqlalchemy.orm import Session, Query

from app.crud.base import CRUDBase
from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate

class CRUDModel(CRUDBase[Model, ModelCreate, ModelUpdate]):
    # Inherit all basic CRUD methods from CRUDBase
    
    # Implement the specific method for car models
    def get_multi_by_ids(self, db: Session, *, ids: List[int]) -> List[Model]:
        # Take in a lists of models' id and get model based on id's
        return db.query(self.model).filter(self.model.id.in_(ids)).all()
    
    # findPaged() in sequence: take in the query and return rows and total
    def get_paged_filtered(self, db: Session, *,
                           query: Query, 
                           skip: int = 0, 
                           limit: int = 100) -> Tuple[List[Model], int]:
        # Get the total number of results that match the query (before pagination)
        total = query.count()
        
        # Apply pagination: get rows for each page
        # Example: each page has 10 rows -> page 2: offset = 10, limit = 10
        # skip = (page - 1) * limit
        # limit = number of records per page
        rows = query.offset(skip).limit(limit).all()
        
        return rows, total
    

crud_model = CRUDModel(Model)