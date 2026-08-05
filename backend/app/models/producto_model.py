from pydantic import BaseModel
from typing import Literal


class ProductoCreateRequest(BaseModel):
    usuarioId: str
    nombre: str
    descripcion: str
    precio: float
    unidades: int
    horaDisponible: str
    puntoEntrega: str
    imagenUrl: str
    archivoUrl: str = ""


class ProductoResponse(BaseModel):
    id: str
    usuarioId: str
    nombre: str
    descripcion: str
    precio: float
    unidades: int
    horaDisponible: str
    puntoEntrega: str
    imagenUrl: str
    archivoUrl: str = ""
    fechaCreacion: str
    likeado: bool = False
    favorito: bool = False


class ProductoResumenResponse(BaseModel):
    id: str
    nombreProducto: str
    precio: float
    imagenUrl: str
    estado: Literal["disponible", "pocas", "agotado"]
    piezasRestantes: int | None = None
    likeado: bool = False
    favorito: bool = False

class VendedorProductoResponse(BaseModel):
    id: str
    userName: str
    correo: str


class ProductoDetalleResponse(BaseModel):
    id: str
    usuarioId: str
    nombre: str
    descripcion: str
    precio: float
    unidades: int
    horaDisponible: str
    puntoEntrega: str
    imagenUrl: str
    archivoUrl: str = ""
    fechaCreacion: str
    likeado: bool = False
    favorito: bool = False
    vendedor: VendedorProductoResponse


class ComprarProductoRequest(BaseModel):
    cantidad: int