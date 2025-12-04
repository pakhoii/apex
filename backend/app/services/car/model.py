# app/services/model_service.py

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate
from app.schemas.audit_log import AuditLogCreate
from app.crud import crud_audit_log, crud_model

class ModelService:
    def create_model(self, db: Session, *, model_data: ModelCreate, user_id: int) -> Model:
        try: 
            new_model = crud_model.create(db, input_object=model_data)
            
            db.flush()
            
            log_data = AuditLogCreate(
                entity_type="Model", entity_id=new_model.id, actor_id=user_id,
                action="create_model", details=f"Created new model: {new_model.name}"
            )
            crud_audit_log.create(db=db, input_object=log_data)
            
            db.commit()
            
            db.refresh(new_model)
            return new_model
        
        except Exception as e:
            db.rollback()
            raise e
        
    def update_model(self, db: Session, *, db_object: Model, 
                    update_data: ModelUpdate, user_id: int) -> Model:
        try: 
            updated_model = crud_model.update(db, db_object=db_object, input_object=update_data)
            
            log_data = AuditLogCreate(
                entity_type="Model", entity_id=updated_model.id, actor_id=user_id,
                action="update_model", details=f"Updated model: {updated_model.name}"
            )
            crud_audit_log.create(db=db, input_object=log_data)
            
            db.commit()
            
            db.refresh(updated_model)
            return updated_model
            
        except Exception as e:
            db.rollback()
            raise e
        
model_service = ModelService()