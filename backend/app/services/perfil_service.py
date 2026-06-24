from fastapi import HTTPException
from app.data.database import perfiles_collection
from app.models.perfil_model import PerfilUpdateRequest


def convertir_perfil(perfil) -> dict:
    return {
        "id": perfil["usuarioId"],
        "nombre": perfil.get("nombre", ""),
        "avatarUrl": perfil.get("avatarUrl", "assets/profile/profile-example.png"),
        "telefono": perfil.get("telefono", ""),
        "instagram": perfil.get("instagram", ""),
        "facebook": perfil.get("facebook", ""),
        "tiktok": perfil.get("tiktok", "")
    }

def obtener_perfil(usuario_id: str):
    perfil = perfiles_collection.find_one({"usuarioId": usuario_id})

    if not perfil:
        raise HTTPException(
            status_code=404,
            detail="Perfil no encontrado"
        )

    return convertir_perfil(perfil)


def actualizar_perfil(usuario_id: str, datos: PerfilUpdateRequest):
    perfil = perfiles_collection.find_one({"usuarioId": usuario_id})

    if not perfil:
        raise HTTPException(
            status_code=404,
            detail="Perfil no encontrado"
        )

    perfiles_collection.update_one(
        {"usuarioId": usuario_id},
        {
            "$set": {
                "telefono": datos.telefono,
                "instagram": datos.instagram,
                "facebook": datos.facebook,
                "tiktok": datos.tiktok
            }
        }
    )

    perfil_actualizado = perfiles_collection.find_one({"usuarioId": usuario_id})

    return convertir_perfil(perfil_actualizado)