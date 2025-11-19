from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate

class CRUDModel(CRUDBase[Brand, BrandCreate, BrandUpdate]):
    def get_by_name(self, db: Session, name: str):
        return db.query(self.model).filter(self.model.name == name).first()


crud_brand = CRUDModel(Brand)