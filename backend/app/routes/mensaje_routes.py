import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.models.mensaje_model import MensajeCreateRequest, MensajeResponse
from app.controllers.mensaje_controller import (
    obtener_chat_controller,
    guardar_mensaje_controller
)
from app.core.webSocket_manager import websocket_manager


router = APIRouter(
    prefix="/mensajes",
    tags=["Mensajes"]
)


@router.get("/{usuario_id}/{contacto_id}", response_model=list[MensajeResponse])
def obtener_chat(usuario_id: str, contacto_id: str):
    return obtener_chat_controller(usuario_id, contacto_id)


@router.post("", response_model=MensajeResponse)
def guardar_mensaje(datos: MensajeCreateRequest):
    return guardar_mensaje_controller(datos)


@router.websocket("/chat/{usuario_id}")
async def websocket_chat(websocket: WebSocket, usuario_id: str):
    print("Intentando conectar websocket:", usuario_id)
    
    await websocket_manager.conectar(usuario_id, websocket)

    print("WebSocket conectado:", usuario_id)

    try:
        while True:
            data = await websocket.receive_text()
            print("Mensaje recibido por WS:", data)

            try:
                mensaje_dict = json.loads(data)
                mensaje = MensajeCreateRequest(**mensaje_dict)

                mensaje_guardado = guardar_mensaje_controller(mensaje)

                print("Tipo:", type(mensaje_guardado))
                print("Contenido:", mensaje_guardado)
                for clave, valor in mensaje_guardado.items():
                    print(clave, type(valor), valor)

                await websocket_manager.enviar_a_chat(
                    mensaje_guardado["emisorId"],
                    mensaje_guardado["receptorId"],
                    mensaje_guardado
                )

            except Exception as error:
                print("Error procesando mensaje WS:", error)

    except WebSocketDisconnect:
        print("WebSocket desconectado:", usuario_id)
        websocket_manager.desconectar(usuario_id, websocket)