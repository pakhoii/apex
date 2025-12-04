import math
from sqlalchemy.orm import Session
from app.crud import crud_model
from app.schemas.model import ModelFilterParams, PaginationParams, PagedModelResponse
from .filter_strategy import car_filter_strategy

class FilterService:
    def list_cars(self, db: Session, *, 
        filters: ModelFilterParams, 
        pagination: PaginationParams) -> PagedModelResponse:

        # 1. validate()
        car_filter_strategy.validate(filters)
        
        # 2. buildSpec() -> spec
        query_spec = car_filter_strategy.build_spec(db, filters)
        
        # 3. findPaged() -> rows, total, total_pages, current_page
        rows, total = crud_model.get_paged_filtered(
            db, 
            query=query_spec, 
            skip=pagination.skip, 
            limit=pagination.limit
        )
        
        total_pages = math.ceil(total / pagination.limit) if pagination.limit > 0 else 0
        current_page = (pagination.skip // pagination.limit) + 1 if pagination.limit > 0 else 1

        
        # 4. mapDto(): DTO is schemas in fast API
        # Returning a Pydantic schema constructed from ORM model instances.
        # Fast api will automatically map them to schema (DTO)
        return PagedModelResponse(
            rows=rows, 
            total=total,
            page=current_page,
            limit=pagination.limit,
            total_pages=total_pages
        )

filter_service = FilterService()