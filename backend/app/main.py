from fastapi import FastAPI, Depends, APIRouter
from app.core.cors import setup_cors
import app.models # Ensure all models are registered
from app.api.v1.endpoints import register
from app.api.v1.endpoints import login
from app.api.v1.endpoints import admin
from app.api.v1.endpoints import order
from app.api.v1.endpoints import brand
from app.api.v1.endpoints import model
from app.api.v1.endpoints import testdrive
from app.api.v1.endpoints import checkout
from app.api.v1.endpoints import cart
# from app.api.v1.endpoints import model_compare

app = FastAPI()

setup_cors(app)

# Include API routers
app.include_router(register.router)
app.include_router(login.router)
app.include_router(admin.router)
app.include_router(order.router)
app.include_router(brand.router)
app.include_router(model.router)
app.include_router(testdrive.router)
app.include_router(checkout.router)
app.include_router(cart.router)
# app.include_router(model_compare.router, prefix="/api/v1")
