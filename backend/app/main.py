# from fastapi import FastAPI, Depends
# from sqlalchemy.orm import Session
# from app.db.session import get_db

# app = FastAPI()

# @app.get("/db-test")
# def db_test(db: Session = Depends(get_db)):
#     result = db.execute("SELECT 1")
#     return {"connected": bool(result.scalar())}
