from fastapi import FastAPI, Depends
from app.core.cors import setup_cors
from app.api.v1.endpoints import register
from app.api.v1.endpoints import login
from app.api.v1.endpoints import admin
from app.api.v1.endpoints import order

app = FastAPI()

setup_cors(app)

# Include API routers
app.include_router(register.router)
app.include_router(login.router)
app.include_router(admin.router)
app.include_router(order.router)