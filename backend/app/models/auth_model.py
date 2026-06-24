from pydantic import BaseModel, EmailStr

class PeticionLogin(BaseModel):
    userName: str
    password: str

class PeticionRegister(BaseModel):
    correo: EmailStr
    userName: str
    password: str
    confirmPassword: str



class UsuarioSesion(BaseModel):
    id: str
    userName:str
    correo: str

class RespuestaAuth(BaseModel):
    token:str
    usuario: UsuarioSesion
