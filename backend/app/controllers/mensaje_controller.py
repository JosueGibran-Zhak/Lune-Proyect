from app.models.mensaje_model import MensajeCreateRequest
from app.services.mensaje_service import obtener_chat, guardar_mensaje


def obtener_chat_controller(usuario_id: str, contacto_id: str):
    return obtener_chat(usuario_id, contacto_id)


def guardar_mensaje_controller(datos: MensajeCreateRequest):
    return guardar_mensaje(datos)