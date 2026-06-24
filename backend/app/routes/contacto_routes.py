from fastapi import APIRouter

from app.models.contacto_model import ContactoResponse, UsuarioBusquedaResponse
from app.controllers.contacto_controller import obtener_contactos_controller,buscar_usuarios_controller,agregar_contacto_controller


router = APIRouter(
    prefix="/contactos",
    tags=["Contactos"]
)

@router.get("/{usuario_id}", response_model=list[ContactoResponse])
def obtener_contactos(usuario_id: str):
    return obtener_contactos_controller(usuario_id)


@router.get("/buscar/{usuario_id}/{texto}", response_model=list[UsuarioBusquedaResponse])
def buscar_usuarios(usuario_id: str, texto: str):
    return buscar_usuarios_controller(usuario_id, texto)


@router.post("/{usuario_id}/{contacto_id}", response_model=ContactoResponse)
def agregar_contacto(usuario_id: str, contacto_id: str):
    return agregar_contacto_controller(usuario_id, contacto_id)