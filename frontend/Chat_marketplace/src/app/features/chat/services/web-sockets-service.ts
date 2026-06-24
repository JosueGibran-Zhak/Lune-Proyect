import { Injectable, inject, signal } from '@angular/core';
import { ChatMessage } from '../models/chat-message';
import { OfflineQueueService } from './offline-queue-service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketsService {
  private offlineQueueService = inject(OfflineQueueService);

  private socket: WebSocket | null = null;
  private usuarioIdActual: string | null = null;
  private alRecibirMensajeActual: ((mensaje: ChatMessage) => void) | null = null;

  conectado = signal(false);

  conectar(
    usuarioId: string,
    alRecibirMensaje: (mensaje: ChatMessage) => void
  ): void {
    this.usuarioIdActual = usuarioId;
    this.alRecibirMensajeActual = alRecibirMensaje;

    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket ya estaba conectado');
      return;
    }

    if (
      this.socket?.readyState === WebSocket.CONNECTING ||
      this.socket?.readyState === WebSocket.CLOSING
    ) {
      console.log('WebSocket todavía está conectando/cerrando');
      return;
    }

    this.socket = null;

    const backendHost = window.location.hostname;
    const wsUrl = `ws://${backendHost}:8000/mensajes/chat/${usuarioId}`;

    console.log('Conectando WebSocket a:', wsUrl);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket conectado');
      this.conectado.set(true);
      this.reenviarPendientes();
    };

    this.socket.onmessage = (event) => {
      console.log('Mensaje recibido por WebSocket:', event.data);

      const mensaje = JSON.parse(event.data) as ChatMessage;

      if (this.alRecibirMensajeActual) {
        this.alRecibirMensajeActual(mensaje);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket cerrado:', event.code, event.reason);
      this.conectado.set(false);
    };

    this.socket.onerror = (error) => {
      console.log('Error WebSocket:', error);
      this.conectado.set(false);
    };
  }

  enviarMensaje(mensaje: ChatMessage): void {

  if (this.socket?.readyState === WebSocket.OPEN) {
    this.socket.send(JSON.stringify(mensaje));
    return;
  }
  const mensajePendiente: ChatMessage = {
    ...mensaje,
    estado: 'pendiente',
  };

  this.offlineQueueService.agregarPendiente(mensajePendiente);

  if (this.alRecibirMensajeActual) {
    this.alRecibirMensajeActual(mensajePendiente);
  }
}

  desconectar(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.conectado.set(false);
  }

  private reenviarPendientes(): void {
    const pendientes = this.offlineQueueService.obtenerPendientes();

    if (pendientes.length === 0) return;

    pendientes.forEach((mensaje) => {
      this.socket?.send(JSON.stringify({
        ...mensaje,
        estado: 'enviado',
      }));
    });

    this.offlineQueueService.limpiarPendientes();
  }

}