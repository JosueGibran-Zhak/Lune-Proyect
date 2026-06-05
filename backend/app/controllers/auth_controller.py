from app.models.auth_model import PeticionLogin, RespuestaLogin
from app.services.auth_service import login_usuario

def login_Controller(credenciales: PeticionLogin) -> RespuestaLogin:
    
    return login_usuario(credenciales)