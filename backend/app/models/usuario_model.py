from pydantic import BaseModel

class Usuario(BaseModel):
    id: int
    userName: str
    password: str