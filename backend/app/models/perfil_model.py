from pydantic import BaseModel

class PerfilResponse(BaseModel):
    id: str
    nombre: str
    avatarUrl: str
    telefono: str = ""
    instagram: str = ""
    facebook: str = ""
    tiktok: str = ""


class PerfilUpdateRequest(BaseModel):
    telefono: str = ""
    instagram: str = ""
    facebook: str = ""
    tiktok: str = ""