from fastapi import HTTPException, status

from sqlalchemy.orm import Session, Query
from app.models import Model, Brand
from app.schemas.model import ModelFilterParams

class CarFilterStrategy:
    def validate(self, filters: ModelFilterParams):
        # Wrong case: min price > max price
        if filters.min_price is not None and filters.max_price is not None:
            if filters.min_price > filters.max_price:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="min_price cannot be greater than max_price"
                )
                
        # Wrong case: min year > max year      
        if filters.min_year is not None and filters.max_year is not None:
            if filters.min_year > filters.max_year:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="min_year cannot be greater than max_year"
                )

    # Take in the parameters and build the query from them
    def build_spec(self, db: Session, filters: ModelFilterParams) -> Query:
        query = db.query(Model)
        
        # Apply the filters
        if filters.search:
            query = query.join(Brand).filter(
                (Model.name.ilike(f"%{filters.search}%")) |
                (Brand.name.ilike(f"%{filters.search}%"))
            )
        
        if filters.brand_id:
            query = query.filter(Model.brand_id == filters.brand_id)
            
        if filters.min_price is not None:
            query = query.filter(Model.price >= filters.min_price)
            
        if filters.max_price is not None:
            query = query.filter(Model.price <= filters.max_price)
            
        if filters.min_year is not None:
            query = query.filter(Model.year >= filters.min_year)
            
        if filters.max_year is not None:
            query = query.filter(Model.year <= filters.max_year)
            
        return query

car_filter_strategy = CarFilterStrategy()
            