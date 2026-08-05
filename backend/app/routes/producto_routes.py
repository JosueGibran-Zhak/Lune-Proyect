from fastapi import APIRouter, UploadFile, File, Form

from app.models.producto_model import (
    ProductoCreateRequest,
    ProductoResponse,
    ProductoResumenResponse,
)

from app.controllers.producto_controller import (
    listar_productos_controller,
    crear_producto_controller,
    cambiar_like_controller,
    cambiar_favorito_controller,
)
from app.models.producto_model import (
    ProductoDetalleResponse,
    ComprarProductoRequest
)

from app.controllers.producto_controller import (
    obtener_producto_detalle_controller,
    comprar_producto_controller
)

from app.services.producto_service import (
    guardar_archivo,
    IMAGENES_DIR,
    ARCHIVOS_DIR,
)


router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


@router.get("", response_model=list[ProductoResumenResponse])
def listar_productos():
    return listar_productos_controller()

@router.get("/{producto_id}", response_model=ProductoDetalleResponse)
def obtener_producto_detalle(producto_id: str):
    return obtener_producto_detalle_controller(producto_id)


@router.patch("/{producto_id}/comprar", response_model=ProductoDetalleResponse)
def comprar_producto(
    producto_id: str,
    datos: ComprarProductoRequest
):
    return comprar_producto_controller(producto_id, datos)


@router.post("", response_model=ProductoResponse)
def crear_producto(
    usuarioId: str = Form(...),
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    unidades: int = Form(...),
    horaDisponible: str = Form(...),
    puntoEntrega: str = Form(...),
    imagen: UploadFile = File(...),
    archivo: UploadFile | None = File(None),
):
    imagen_url = guardar_archivo(imagen, IMAGENES_DIR, "imagenes")

    archivo_url = ""

    if archivo:
        archivo_url = guardar_archivo(archivo, ARCHIVOS_DIR, "archivos")

    datos = ProductoCreateRequest(
        usuarioId=usuarioId,
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        unidades=unidades,
        horaDisponible=horaDisponible,
        puntoEntrega=puntoEntrega,
        imagenUrl=imagen_url,
        archivoUrl=archivo_url,
    )

    return crear_producto_controller(datos)


@router.patch("/{producto_id}/like", response_model=ProductoResumenResponse)
def cambiar_like(producto_id: str):
    return cambiar_like_controller(producto_id)


@router.patch("/{producto_id}/favorito", response_model=ProductoResumenResponse)
def cambiar_favorito(producto_id: str):
    return cambiar_favorito_controller(producto_id)