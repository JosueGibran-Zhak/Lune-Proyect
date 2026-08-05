from datetime import datetime
from pathlib import Path
from uuid import uuid4

from bson import ObjectId
from fastapi import HTTPException, UploadFile

from app.data.database import productos_collection, usuarios_collection
from app.models.producto_model import ProductoCreateRequest, ComprarProductoRequest

#Dado que Angular ya no recibe la peticion, se crea la url base para que el navegador pueda buscar el archivo
BASE_URL ="http://localhost:8000"

UPLOAD_DIR = Path("app/uploads/productos")
IMAGENES_DIR = UPLOAD_DIR / "imagenes"
ARCHIVOS_DIR = UPLOAD_DIR / "archivos"

IMAGENES_DIR.mkdir(parents=True, exist_ok=True)
ARCHIVOS_DIR.mkdir(parents=True, exist_ok=True)


def guardar_archivo(file: UploadFile, carpeta: Path, tipo: str) -> str:
    extension = Path(file.filename).suffix
    nombre_archivo = f"{uuid4()}{extension}"
    ruta = carpeta / nombre_archivo

    with open(ruta, "wb") as buffer:
        buffer.write(file.file.read())

    return f"/uploads/productos/{tipo}/{nombre_archivo}"


def calcular_estado(unidades: int):
    if unidades <= 0:
        return "agotado"

    if unidades <= 5:
        return "pocas"

    return "disponible"


def convertir_producto(producto):
    return {
        "id": str(producto["_id"]),
        "usuarioId": producto["usuarioId"],
        "nombre": producto["nombre"],
        "descripcion": producto["descripcion"],
        "precio": producto["precio"],
        "unidades": producto["unidades"],
        "horaDisponible": producto["horaDisponible"],
        "puntoEntrega": producto["puntoEntrega"],
        "imagenUrl": f"{BASE_URL}{producto['imagenUrl']}",
        "archivoUrl": producto.get("archivoUrl", ""),
        "fechaCreacion": producto["fechaCreacion"],
        "likeado": producto.get("likeado", False),
        "favorito": producto.get("favorito", False),
    }


def convertir_resumen(producto):
    estado = calcular_estado(producto["unidades"])

    return {
        "id": str(producto["_id"]),
        "nombreProducto": producto["nombre"],
        "precio": producto["precio"],
        "imagenUrl": f"{BASE_URL}{producto['imagenUrl']}",
        "estado": estado,
        "piezasRestantes": producto["unidades"] if estado == "pocas" else None,
        "likeado": producto.get("likeado", False),
        "favorito": producto.get("favorito", False),
    }


def listar_productos():
    productos = productos_collection.find().sort("fechaCreacion", -1)
    return [convertir_resumen(producto) for producto in productos]


def crear_producto(datos: ProductoCreateRequest):
    if not datos.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre es obligatorio")

    if not datos.descripcion.strip():
        raise HTTPException(status_code=400, detail="La descripción es obligatoria")

    if datos.precio <= 0:
        raise HTTPException(status_code=400, detail="El precio debe ser mayor a 0")

    if datos.unidades < 0:
        raise HTTPException(status_code=400, detail="Las unidades no pueden ser negativas")

    if not datos.horaDisponible.strip():
        raise HTTPException(status_code=400, detail="La hora disponible es obligatoria")

    if not datos.puntoEntrega.strip():
        raise HTTPException(status_code=400, detail="El punto de entrega es obligatorio")

    producto = {
        "usuarioId": datos.usuarioId,
        "nombre": datos.nombre.strip(),
        "descripcion": datos.descripcion.strip(),
        "precio": datos.precio,
        "unidades": datos.unidades,
        "horaDisponible": datos.horaDisponible.strip(),
        "puntoEntrega": datos.puntoEntrega.strip(),
        "imagenUrl": datos.imagenUrl,
        "archivoUrl": datos.archivoUrl,
        "fechaCreacion": datetime.now().isoformat(),
        "likeado": False,
        "favorito": False,
    }

    resultado = productos_collection.insert_one(producto)
    producto["_id"] = resultado.inserted_id

    return convertir_producto(producto)


def cambiar_like(producto_id: str):
    producto = productos_collection.find_one({"_id": ObjectId(producto_id)})

    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    nuevo_valor = not producto.get("likeado", False)

    productos_collection.update_one(
        {"_id": ObjectId(producto_id)},
        {"$set": {"likeado": nuevo_valor}}
    )

    producto["likeado"] = nuevo_valor

    return convertir_resumen(producto)


def cambiar_favorito(producto_id: str):
    producto = productos_collection.find_one({"_id": ObjectId(producto_id)})

    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    nuevo_valor = not producto.get("favorito", False)

    productos_collection.update_one(
        {"_id": ObjectId(producto_id)},
        {"$set": {"favorito": nuevo_valor}}
    )

    producto["favorito"] = nuevo_valor

    return convertir_resumen(producto)

def obtener_producto_detalle(producto_id: str):
    producto = productos_collection.find_one({
        "_id": ObjectId(producto_id)
    })

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    vendedor = usuarios_collection.find_one({
        "_id": ObjectId(producto["usuarioId"])
    })

    if not vendedor:
        raise HTTPException(
            status_code=404,
            detail="Vendedor no encontrado"
        )

    return {
        "id": str(producto["_id"]),
        "usuarioId": producto["usuarioId"],

        "nombre": producto["nombre"],
        "descripcion": producto["descripcion"],

        "precio": producto["precio"],
        "unidades": producto["unidades"],

        "horaDisponible": producto["horaDisponible"],
        "puntoEntrega": producto["puntoEntrega"],

        "imagenUrl": f"{BASE_URL}{producto['imagenUrl']}",
        "archivoUrl": producto.get("archivoUrl", ""),

        "fechaCreacion": producto["fechaCreacion"],

        "likeado": producto.get("likeado", False),
        "favorito": producto.get("favorito", False),

        "vendedor": {
            "id": str(vendedor["_id"]),
            "userName": vendedor["userName"],
            "correo": vendedor["correo"]
        }
    }


def comprar_producto(producto_id: str, datos: ComprarProductoRequest):
    if datos.cantidad <= 0:
        raise HTTPException(
            status_code=400,
            detail="La cantidad debe ser mayor a 0"
        )

    producto = productos_collection.find_one({
        "_id": ObjectId(producto_id)
    })

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    if producto["unidades"] < datos.cantidad:
        raise HTTPException(
            status_code=400,
            detail="No hay suficientes unidades disponibles"
        )

    nuevas_unidades = producto["unidades"] - datos.cantidad

    productos_collection.update_one(
        {"_id": ObjectId(producto_id)},
        {"$set": {"unidades": nuevas_unidades}}
    )

    return obtener_producto_detalle(producto_id)