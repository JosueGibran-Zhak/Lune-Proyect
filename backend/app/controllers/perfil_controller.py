from app.models.perfil_model import PerfilUpdateRequest
from app.services.perfil_service import obtener_perfil, actualizar_perfil


def obtener_perfil_controller(usuario_id: str):
    return obtener_perfil(usuario_id)


def actualizar_perfil_controller(usuario_id: str, datos: PerfilUpdateRequest):
    return actualizar_perfil(usuario_id, datos)