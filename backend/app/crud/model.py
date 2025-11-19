from typing import List
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate

class CRUDModel(CRUDBase[Model, ModelCreate, ModelUpdate]):
    # Inherit all basic CRUD methods from CRUDBase
    
    # Implement the specific method for car models
    def get_multi_by_ids(self, db: Session, *, ids: List[int]) -> List[Model]:
        # Take in a lists of models' id and get model based on id's
        return db.query(self.model).filter(self.model.id.in_(ids)).all()

crud_model = CRUDModel(Model)