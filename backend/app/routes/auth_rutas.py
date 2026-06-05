"""
auth_rutas.py

Rutas REST relacionadas con autenticación.
"""

from fastapi import APIRouter
from app.models.auth_model import PeticionLogin, RespuestaLogin
from app.controllers.auth_controller import login_usuario


router = APIRouter(
    prefix="/api",
    tags=["Autenticación"]
)


@router.post("/auth-page", response_model=RespuestaLogin)
def login(credenciales: PeticionLogin):
    """
    Endpoint usado por Angular para iniciar sesión.

    URL:
    POST http://127.0.0.1:8000/api/auth_rutas

    Body:
    {
        "username": "alumno",
        "password": "1234"
    }
    """
    
    return login_usuario(credenciales)