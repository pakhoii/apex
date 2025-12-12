# app/services/brand_service.py

from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate
from app.schemas.audit_log import AuditLogCreate
from app.crud import crud_audit_log, crud_brand
from app.services.storage.storage_service import storage_service

class BrandService:
    def create_brand(
            self, 
            db: Session, 
            *, 
            brand_data: BrandCreate, 
            user_id: int,
            logo_file: Optional[UploadFile] = None
        ) -> Brand:
        # Check if the brand is already exist
        existing_brand = crud_brand.get_by_name(db, name=brand_data.name) # Giả sử có hàm này trong crud_brand
        if existing_brand:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Brand with name '{brand_data.name}' already exists."
            )
            
        try:
            if logo_file:
                # Validate file type
                if not logo_file.content_type.startswith('image/'):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="File must be an image"
                    )
                logo_url = storage_service.upload_image(logo_file, folder="brands")
            
            # Create brand object with logo_url
            brand_create_data = brand_data.model_dump()
            brand_create_data['logo_url'] = logo_url
            
            new_brand = crud_brand.create(db, input_object=BrandCreate(**brand_create_data))
            
            db.flush()

            log_data = AuditLogCreate(
                entity_type="Brand", entity_id=new_brand.id, actor_id=user_id,
                action="create_brand", details=f"Created new brand: {new_brand.name}"
            )
            crud_audit_log.create(db=db, input_object=log_data)

            db.commit()            
            db.refresh(new_brand)
            
            return new_brand
        
        except Exception as e:
            db.rollback()
            raise e
        
    def update_brand(
        self, 
        db: Session, 
        *, 
        db_object: Brand, 
        update_data: BrandUpdate, 
        user_id: int,
        logo_file: Optional[UploadFile] = None
    ) -> Brand:
        try: 
            # Upload new logo if provided
            if logo_file:
                if not logo_file.content_type.startswith('image/'):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="File must be an image"
                    )
                new_logo_url = storage_service.upload_image(logo_file, folder="brands")
                update_data.logo_url = new_logo_url
            
            updated_brand = crud_brand.update(db, db_object=db_object, input_object=update_data)
            
            log_data = AuditLogCreate(
                entity_type="Brand", entity_id=updated_brand.id, actor_id=user_id,
                action="update_brand", details=f"Updated brand: {updated_brand.name}"
            )
            crud_audit_log.create(db=db, input_object=log_data)
 
            db.commit()            
            db.refresh(updated_brand)

            return updated_brand
            
        except Exception as e:
            db.rollback()
            raise e
        
brand_service = BrandService()