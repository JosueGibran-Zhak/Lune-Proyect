"""
auth_rutas.py

Rutas REST relacionadas con autenticación.
"""

from fastapi import APIRouter
from app.models.auth_model import PeticionLogin,PeticionRegister, RespuestaAuth
from app.controllers.auth_controller import registrar_Controller, login_Controller


router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)


@router.post("/login", response_model=RespuestaAuth)
def login(credenciales: PeticionLogin):
    return login_Controller(credenciales)

@router.post("/register", response_model= RespuestaAuth)
def register(datos: PeticionRegister):
    return registrar_Controller(datos)