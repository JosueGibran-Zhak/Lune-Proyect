from bson import ObjectId
from fastapi import HTTPException

from app.data.database import usuarios_collection, perfiles_collection, contactos_collection


def convertir_contacto(contacto):
    return {
        "id": str(contacto["_id"]),
        "contactoId": contacto["contactoId"],
        "usuario": contacto["usuario"],
        "noLeidos": contacto.get("noLeidos", 0),
        "avatarUrl": contacto.get("avatarUrl", "")
    }


def obtener_contactos(usuario_id: str):
    contactos = contactos_collection.find({"usuarioId": usuario_id})

    return [convertir_contacto(contacto) for contacto in contactos]


def buscar_usuarios(usuario_id: str, texto: str):
    usuarios = usuarios_collection.find({
        "$or": [
            {"userName": {"$regex": texto, "$options": "i"}},
            {"correo": {"$regex": texto, "$options": "i"}}
        ]
    })

    contactos_actuales = contactos_collection.find({"usuarioId": usuario_id})
    ids_agregados = [contacto["contactoId"] for contacto in contactos_actuales]

    resultados = []

    for usuario in usuarios:
        id_usuario = str(usuario["_id"])

        if id_usuario == usuario_id:
            continue

        perfil = perfiles_collection.find_one({"usuarioId": id_usuario})

        resultados.append({
            "id": id_usuario,
            "usuario": usuario["userName"],
            "avatarUrl": perfil.get("avatarUrl", "") if perfil else "",
            "agregado": id_usuario in ids_agregados
        })

    return resultados


def agregar_contacto(usuario_id: str, contacto_id: str):
    if usuario_id == contacto_id:
        raise HTTPException(status_code=400, detail="No puedes agregarte a ti mismo")

    usuario_contacto = usuarios_collection.find_one({"_id": ObjectId(contacto_id)})

    if not usuario_contacto:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    contacto_existente = contactos_collection.find_one({
        "usuarioId": usuario_id,
        "contactoId": contacto_id
    })

    if contacto_existente:
        raise HTTPException(status_code=400, detail="El contacto ya está agregado")

    perfil = perfiles_collection.find_one({"usuarioId": contacto_id})

    nuevo_contacto = {
        "usuarioId": usuario_id,
        "contactoId": contacto_id,
        "usuario": usuario_contacto["userName"],
        "noLeidos": 0,
        "avatarUrl": perfil.get("avatarUrl", "") if perfil else ""
    }

    resultado = contactos_collection.insert_one(nuevo_contacto)

    nuevo_contacto["_id"] = resultado.inserted_id

    return convertir_contacto(nuevo_contacto)