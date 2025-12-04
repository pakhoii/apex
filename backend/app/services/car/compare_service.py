from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.model import Model
from app.schemas.model_compare import ModelCompareParams, ModelCompareResponse, ModelComparison, ModelCompareValue, ModelOut

class CompareService:
    def compare_models(self, db: Session, params: ModelCompareParams) -> ModelCompareResponse:
        # Step 1: Validate IDs (already handled by Pydantic schema validation, but good to be safe)
        # The Pydantic schema handles the count and uniqueness validation.

        # Step 2: Fetch models directly from the database
        models = db.query(Model).filter(Model.id.in_(params.ids)).all()
        
        found_ids = {model.id for model in models}
        missing_ids = set(params.ids) - found_ids
        
        if missing_ids:
            raise HTTPException(status_code=404, detail=f"Models with IDs {missing_ids} not found")

        # Step 3: Determine fields to compare
        fields_to_compare = ["price", "year", "amount"]
        # Optional fields check could be added here if Model has them dynamically, 
        # but for now we stick to the requirements and what's in Model.
        # Checking if horsepower and torque exist in Model attributes (they don't in the provided file, so skipping)

        # Step 4: Build the comparison result
        comparisons = []
        for field in fields_to_compare:
            values = []
            for model in models:
                val = getattr(model, field, None)
                values.append(
                    ModelCompareValue(
                        model_id=model.id,
                        model_name=model.name,
                        value=val
                    )
                )
            comparisons.append(ModelComparison(field=field, values=values))

        # Step 5: Return ModelCompareResponse
        # Convert ORM models to Pydantic models for the response
        model_outs = [ModelOut.model_validate(model) for model in models]

        return ModelCompareResponse(models=model_outs, comparisons=comparisons)

compare_service = CompareService()
