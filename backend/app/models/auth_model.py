from pydantic import BaseModel

class PeticionLogin(BaseModel):
    userName: str
    password: str

class Usuario(BaseModel):
    id: str
    userName:str

class RespuestaLogin(BaseModel):
    token:str
    usuario: Usuario
