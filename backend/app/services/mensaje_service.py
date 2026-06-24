from app.data.database import mensajes_collection
from app.models.mensaje_model import MensajeCreateRequest


def convertir_mensaje(mensaje) -> dict:
    return {
        "id": mensaje["id"],
        "emisorId": mensaje["emisorId"],
        "receptorId": mensaje["receptorId"],
        "texto": mensaje.get("texto", ""),
        "tipo": mensaje.get("tipo", "texto"),
        "archivoUrl": mensaje.get("archivoUrl", ""),
        "fecha": mensaje["fecha"],
        "estado": mensaje.get("estado", "enviado")
    }


def obtener_chat(usuario_id: str, contacto_id: str):
    mensajes = mensajes_collection.find({
        "$or": [
            {"emisorId": usuario_id, "receptorId": contacto_id},
            {"emisorId": contacto_id, "receptorId": usuario_id}
        ]
    }).sort("fecha", 1)

    return [convertir_mensaje(mensaje) for mensaje in mensajes]


def guardar_mensaje(datos: MensajeCreateRequest):
    mensaje_existente = mensajes_collection.find_one({"id": datos.id})

    mensaje = {
        "id": datos.id,
        "emisorId": datos.emisorId,
        "receptorId": datos.receptorId,
        "texto": datos.texto,
        "tipo": datos.tipo,
        "archivoUrl": datos.archivoUrl,
        "fecha": datos.fecha,
        "estado": "enviado"
    }

    if mensaje_existente:
        mensajes_collection.update_one(
            {"id": datos.id},
            {"$set": mensaje}
        )
    else:
        mensajes_collection.insert_one(mensaje)

    return mensaje