"""
main.py

Archivo principal del backend FastAPI.

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.auth_rutas import router as auth_router
from app.routes.perfil_routes import router as perfil_router
from app.routes.contacto_routes import router as contacto_router
from app.routes.mensaje_routes import router as mensaje_router
from app.routes.producto_routes import router as producto_router


app = FastAPI(
    title="API Lune",
    description="Backend para login, historial de mensajes y chat en tiempo real con WebSockets.",
    version="1.0.0"
)

app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
        #"http://localhost:4200",
        #"http://127.0.0.1:4200"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(perfil_router)
app.include_router(contacto_router)
app.include_router(mensaje_router)  
app.include_router(producto_router)

@app.get("/")
def inicio():
    return {
        "mensaje": "Backend del chat funcionando correctamente"
    }