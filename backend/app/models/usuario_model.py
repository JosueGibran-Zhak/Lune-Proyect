from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    id: int
    correo: EmailStr
    userName: str
    password: str