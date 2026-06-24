from pydantic import BaseModel
from typing import Literal


class MensajeCreateRequest(BaseModel):
    id: str
    emisorId: str
    receptorId: str
    texto: str
    tipo: Literal["texto", "imagen", "archivo"] = "texto"
    archivoUrl: str = ""
    fecha: str
    estado: Literal["enviado", "pendiente"] = "enviado"


class MensajeResponse(BaseModel):
    id: str
    emisorId: str
    receptorId: str
    texto: str
    tipo: str
    archivoUrl: str = ""
    fecha: str
    estado: str