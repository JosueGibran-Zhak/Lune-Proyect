from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    id: str
    correo: EmailStr
    userName: str
    password: str