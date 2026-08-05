from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.conexiones: dict[str, list[WebSocket]] = {}

    async def conectar(self, usuario_id: str, websocket: WebSocket):
        await websocket.accept()

        if usuario_id not in self.conexiones:
            self.conexiones[usuario_id] = []

        self.conexiones[usuario_id].append(websocket)
        print(f"ACTIVES USERS: {list(self.conexiones.keys())}")
    def desconectar(self, usuario_id: str, websocket: WebSocket):
        if usuario_id not in self.conexiones:
            return

        if websocket in self.conexiones[usuario_id]:
            self.conexiones[usuario_id].remove(websocket)

        if len(self.conexiones[usuario_id]) == 0:
            del self.conexiones[usuario_id]

    async def enviar_a_usuario(self, usuario_id: str, mensaje: dict):
        if usuario_id not in self.conexiones:
            print(f"❌ CANNOT SEND: {usuario_id} is not in active connections -> {list(self.conexiones.keys())}")
            return

        print(f"📤 Sending to {usuario_id} ({len(self.conexiones[usuario_id])} sockets open)")
        
        # Copiamos la lista para iterar de manera segura
        for websocket in list(self.conexiones[usuario_id]):
            try:
                await websocket.send_json(mensaje)
                print(f"✅ Message sent successfully to socket of {usuario_id}")
            except Exception as e:
                print(f"⚠️ Failed to send to socket of {usuario_id}, removing dead socket: {e}")
                self.desconectar(usuario_id, websocket)

    async def enviar_a_chat(self, emisor_id: str, receptor_id: str, mensaje: dict):
        print(f"🔄 Routing message from {emisor_id} to {receptor_id}")
        await self.enviar_a_usuario(emisor_id, mensaje)
        await self.enviar_a_usuario(receptor_id, mensaje)


websocket_manager = WebSocketManager()