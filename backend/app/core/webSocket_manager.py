from fastapi import WebSocket


class WebSocketManager:
    def __init__(self):
        self.conexiones: dict[str, list[WebSocket]] = {}

    async def conectar(self, usuario_id: str, websocket: WebSocket):
        await websocket.accept()

        if usuario_id not in self.conexiones:
            self.conexiones[usuario_id] = []

        self.conexiones[usuario_id].append(websocket)

    def desconectar(self, usuario_id: str, websocket: WebSocket):
        if usuario_id not in self.conexiones:
            return

        if websocket in self.conexiones[usuario_id]:
            self.conexiones[usuario_id].remove(websocket)

        if len(self.conexiones[usuario_id]) == 0:
            del self.conexiones[usuario_id]

    async def enviar_a_usuario(self, usuario_id: str, mensaje: dict):
        if usuario_id not in self.conexiones:
            return

        for websocket in self.conexiones[usuario_id]:
            await websocket.send_json(mensaje)

    async def enviar_a_chat(self, emisor_id: str, receptor_id: str, mensaje: dict):
        await self.enviar_a_usuario(emisor_id, mensaje)
        await self.enviar_a_usuario(receptor_id, mensaje)


websocket_manager = WebSocketManager()