from app.services.contacto_service import obtener_contactos, buscar_usuarios, agregar_contacto

def obtener_contactos_controller(usuario_id: str):
    return obtener_contactos(usuario_id)


def buscar_usuarios_controller(usuario_id: str, texto: str):
    return buscar_usuarios(usuario_id, texto)


def agregar_contacto_controller(usuario_id: str, contacto_id: str):
    return agregar_contacto(usuario_id, contacto_id)