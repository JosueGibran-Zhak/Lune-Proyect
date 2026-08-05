from app.models.producto_model import ProductoCreateRequest, ComprarProductoRequest
from app.services.producto_service import (
    listar_productos,
    crear_producto,
    cambiar_like,
    cambiar_favorito,
    obtener_producto_detalle,
    comprar_producto
)


def listar_productos_controller():
    return listar_productos()

def crear_producto_controller(datos: ProductoCreateRequest):
    return crear_producto(datos)


def cambiar_like_controller(producto_id: str):
    return cambiar_like(producto_id)


def cambiar_favorito_controller(producto_id: str):
    return cambiar_favorito(producto_id)

def obtener_producto_detalle_controller(producto_id: str):
    return obtener_producto_detalle(producto_id)


def comprar_producto_controller(
    producto_id: str,
    datos: ComprarProductoRequest
):
    return comprar_producto(producto_id, datos)