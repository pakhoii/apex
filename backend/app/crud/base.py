from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import Base

# Define model type that only accept models that are defined in app/models 
ModelType = TypeVar("ModelType", bound=Base) 

# Type var for update and create new schema, only accept pydantic model that are defined in app/schemas
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
        
    
    # READ
    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()
    
    
    # * is used to force 'skip' and 'limit' to be keyword-only arguments,
    # meaning they must be passed as skip=... and limit=... instead of by position.
    # This improves clarity and prevents accidental misuse.
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()
    
    
    # CREATE
    def create(self, db: Session, input_object: CreateSchemaType) -> ModelType:
        input_object_data = input_object.model_dump()
        db_object = self.model(**input_object_data)
        
        db.add(db_object)
        # db.commit()
        # # Update the object with the data from database
        # db.refresh(db_object) 
        
        return db_object
    
    
    # UPDATE
    def update(self, db: Session, *,
                db_object: ModelType, # current object from db
                input_object: Union[UpdateSchemaType, Dict[str, Any]]) -> ModelType:
        object_data = db_object.__dict__
        
        if (isinstance(input_object, dict)):
            update_data = input_object
        else:
            update_data = input_object.model_dump(exclude_unset=True)
            
        for field in object_data:
            if field in update_data:
                setattr(db_object, field, update_data[field])

        db.add(db_object)
        # db.commit()
        # db.refresh(db_object)
        
        return db_object
    
    
    # DELETE
    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        # db.commit()
        return obj