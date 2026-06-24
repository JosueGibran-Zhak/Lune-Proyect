from fastapi import APIRouter
from app.models.perfil_model import PerfilResponse, PerfilUpdateRequest
from app.controllers.perfil_controller import (
    obtener_perfil_controller,
    actualizar_perfil_controller
)

router = APIRouter(
    prefix="/perfil",
    tags=["Perfil"]
)

@router.get("/{usuario_id}", response_model=PerfilResponse)
def obtener_perfil(usuario_id: str):
    return obtener_perfil_controller(usuario_id)


@router.put("/{usuario_id}", response_model=PerfilResponse)
def actualizar_perfil(usuario_id: str, datos: PerfilUpdateRequest):
    return actualizar_perfil_controller(usuario_id, datos)