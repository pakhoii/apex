# app/services/car/model.py

from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate
from app.schemas.audit_log import AuditLogCreate
from app.crud import crud_audit_log, crud_model
from app.services.storage.storage_service import storage_service

class ModelService:
    def create_model(
        self, 
        db: Session, 
        *, 
        model_data: ModelCreate, 
        user_id: int,
        image_file: Optional[UploadFile] = None
    ) -> Model:
        try:
            # Upload image if provided
            image_url = None
            if image_file:
                # Validate file type
                if not image_file.content_type.startswith('image/'):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="File must be an image"
                    )
                image_url = storage_service.upload_image(image_file, folder="models")
            
            # Create model object with image_url
            model_create_data = model_data.model_dump()
            model_create_data['image_url'] = image_url
            
            new_model = crud_model.create(db, input_object=ModelCreate(**model_create_data))
            
            db.flush()
            
            log_data = AuditLogCreate(
                entity_type="Model", entity_id=new_model.id, actor_id=user_id,
                action="create_model", details=f"Created new model: {new_model.name}"
            )
            crud_audit_log.create(db=db, input_object=log_data)
            
            db.commit()
            
            db.refresh(new_model)
            return new_model
        
        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create model: {str(e)}"
            )
        
    def update_model(
        self, 
        db: Session, 
        *, 
        db_object: Model, 
        update_data: ModelUpdate, 
        user_id: int,
        image_file: Optional[UploadFile] = None
    ) -> Model:
        try:
            # Upload new image if provided
            if image_file:
                if not image_file.content_type.startswith('image/'):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="File must be an image"
                    )
                new_image_url = storage_service.upload_image(image_file, folder="models")
                update_data.image_url = new_image_url
            
            updated_model = crud_model.update(db, db_object=db_object, input_object=update_data)
            
            log_data = AuditLogCreate(
                entity_type="Model", entity_id=updated_model.id, actor_id=user_id,
                action="update_model", details=f"Updated model: {updated_model.name}"
            )
            crud_audit_log.create(db=db, input_object=log_data)
            
            db.commit()
            
            db.refresh(updated_model)
            return updated_model
            
        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update model: {str(e)}"
            )
        
model_service = ModelService()