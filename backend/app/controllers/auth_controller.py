from app.models.auth_model import PeticionLogin,PeticionRegister, RespuestaAuth
from app.services.auth_service import login_usuario, registrar_usuario

def login_Controller(credenciales: PeticionLogin) -> RespuestaAuth:
    return login_usuario(credenciales)


def registrar_Controller(datos: PeticionRegister) -> RespuestaAuth:
    return registrar_usuario(datos)