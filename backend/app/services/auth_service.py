from fastapi import HTTPException
from app.data.usuarios_data import usuarios_db
from app.models.auth_model import RespuestaLogin, PeticionLogin, Usuario

def login_usuario(credenciales: PeticionLogin) -> RespuestaLogin:

    for usuario in usuarios_db:
        if (
            usuario.userName == credenciales.userName
            and usuario.password == credenciales.password
        ):
            token = f"token-{usuario.id}-{usuario.userName}"

            return RespuestaLogin(
                token=token,
                usuario=Usuario(
                    id=usuario.id,
                    userName=usuario.userName
                )
            )

    raise HTTPException(
        status_code=401,
        detail="Usuario o contraseña incorrectos"
    )