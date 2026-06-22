from fastapi import HTTPException
from app.data.usuarios_data import usuarios_db
from app.models.auth_model import PeticionLogin,PeticionRegister, RespuestaAuth, UsuarioSesion 
from app.models.usuario_model import Usuario


#Función para loguear a un usuario
def login_usuario(credenciales: PeticionLogin) -> RespuestaAuth:

    for usuario in usuarios_db:
        if (
            usuario.userName == credenciales.userName
            and usuario.password == credenciales.password
        ):
            token = f"token-{usuario.id}-{usuario.userName}"

            return RespuestaAuth(
                token=token,
                usuario=UsuarioSesion(
                    id=usuario.id,
                    userName=usuario.userName,
                    correo = usuario.correo
                )
            )

    raise HTTPException(
        status_code=401,
        detail="Usuario o contraseña incorrectos"
    )

#Función para registrar a los usuarios 
def registrar_usuario(datos: PeticionRegister) -> RespuestaAuth:

    if datos.password != datos.confirmPassword:
        raise HTTPException(
            status_code= 400, 
            detail= "Las contraseñas no coinciden"
        )
    
    for usuario in usuarios_db:
        if ( usuario.userName == datos.userName):
            raise HTTPException(
                status_code=400,
                detail= "El usuario ya existe"
            )
        
        if usuario.correo == datos.correo:
            raise HTTPException(
                status_code=400, 
                detail="El correo ya está registrado"
        )
    
    nuevo_usuario = Usuario(
        id= len(usuarios_db) + 1,
        correo = datos.correo,
        userName = datos.userName,
        password = datos.password
    )
    usuarios_db.append(nuevo_usuario)
    
    token = f"token-{nuevo_usuario.id}-{nuevo_usuario.password}"
    
    return RespuestaAuth(
                token=token,
                usuario=UsuarioSesion(
                    id= nuevo_usuario.id,
                    userName=nuevo_usuario.userName,
                    correo = nuevo_usuario.correo
                )
            )