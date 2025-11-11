from fastapi import FastAPI, Depends
from app.core.cors import setup_cors
from app.api.v1.endpoints import register
from app.api.v1.endpoints import login

app = FastAPI()

setup_cors(app)

# Include API routers
app.include_router(register.router)
app.include_router(login.router)