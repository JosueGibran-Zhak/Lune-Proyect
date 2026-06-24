"""
main.py

Archivo principal del backend FastAPI.

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_rutas import router as auth_router
from app.routes.perfil_routes import router as perfil_router
from app.routes.contacto_routes import router as contacto_router
from app.routes.mensaje_routes import router as mensaje_router

app = FastAPI(
    title="API Lune",
    description="Backend para login, historial de mensajes y chat en tiempo real con WebSockets.",
    version="1.0.0"
)

"""
CORS permite que Angular pueda comunicarse con FastAPI.

Angular:
http://localhost:4200

FastAPI:
http://127.0.0.1:8000
"""
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

"""
Se registran las rutas REST.

auth_router:
- POST /api/login

chat_router:
- GET /api/mensajes
- WebSocket /ws/chat
"""
app.include_router(auth_router)
app.include_router(perfil_router)
app.include_router(contacto_router)
app.include_router(mensaje_router)  

@app.get("/")
def inicio():
    return {
        "mensaje": "Backend del chat funcionando correctamente"
    }