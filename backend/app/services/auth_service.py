from fastapi import HTTPException
from app.data.database import usuarios_collection, perfiles_collection
from app.models.auth_model import PeticionLogin, PeticionRegister, RespuestaAuth, UsuarioSesion


def convertir_usuario_sesion(usuario) -> UsuarioSesion:
    return UsuarioSesion(
        id=str(usuario["_id"]),
        userName=usuario["userName"],
        correo=usuario["correo"]
    )


def login_usuario(credenciales: PeticionLogin) -> RespuestaAuth:

    usuario = usuarios_collection.find_one({
        "userName": credenciales.userName,
        "password": credenciales.password
    })

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )

    usuario_sesion = convertir_usuario_sesion(usuario)

    token = f"token-{usuario_sesion.id}-{usuario_sesion.userName}"

    return RespuestaAuth(
        token=token,
        usuario=usuario_sesion
    )


def registrar_usuario(datos: PeticionRegister) -> RespuestaAuth:

    if datos.password != datos.confirmPassword:
        raise HTTPException(
            status_code=400,
            detail="Las contraseñas no coinciden"
        )

    usuario_existente = usuarios_collection.find_one({
        "userName": datos.userName
    })

    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya existe"
        )

    correo_existente = usuarios_collection.find_one({
        "correo": datos.correo
    })

    if correo_existente:
        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )

    nuevo_usuario = {
        "correo": datos.correo,
        "userName": datos.userName,
        "password": datos.password
    }

    resultado = usuarios_collection.insert_one(nuevo_usuario)

    usuario_id = str(resultado.inserted_id)

    perfiles_collection.insert_one({
        "usuarioId": usuario_id,
        "nombre": datos.userName,
        "avatarUrl": "assets/profile/profile-example.png",
        "telefono": "",
        "instagram": "",
        "facebook": "",
        "tiktok": ""
    })

    usuario_sesion = UsuarioSesion(
        id=usuario_id,
        userName=datos.userName,
        correo=datos.correo
    )

    token = f"token-{usuario_sesion.id}-{usuario_sesion.userName}"

    return RespuestaAuth(
        token=token,
        usuario=usuario_sesion
    )