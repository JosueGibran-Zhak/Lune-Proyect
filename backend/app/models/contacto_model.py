from pydantic import BaseModel


class ContactoResponse(BaseModel):
    id: str
    contactoId: str
    usuario: str
    noLeidos: int = 0
    avatarUrl: str = ""

class UsuarioBusquedaResponse(BaseModel):
    id: str
    usuario: str
    avatarUrl: str = ""
    agregado: bool = False