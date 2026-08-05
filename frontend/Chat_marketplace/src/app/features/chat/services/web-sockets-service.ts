import { Injectable, inject, signal, NgZone } from '@angular/core';
import { ChatMessage } from '../models/chat-message';
import { OfflineQueueService } from './offline-queue-service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketsService {
  private offlineQueueService = inject(OfflineQueueService);

  // 1. INYECCIÓN DE NGZONE:
  // NgZone es la "herramienta de vigilancia" de Angular. 
  // Le avisa al motor de Angular cuando ocurre un cambio en segundo plano para que vuelva a pintar el HTML.
  private zone = inject(NgZone);

  private socket: WebSocket | null = null;
  private alRecibirMensajeActual: ((mensaje: ChatMessage) => void) | null = null;

  conectado = signal(false);

  conectar(
    usuarioId: string,
    alRecibirMensaje: (mensaje: ChatMessage) => void
  ): void {
    //Guardamos la función callback que nos envía el ChatService
    if (alRecibirMensaje) {
      this.alRecibirMensajeActual = alRecibirMensaje;
    }

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

    // EVENTO DE CONEXIÓN:
    this.socket.onopen = () => {
      // Usamos zone.run(...) porque 'onopen' sucede fuera del Radar de Angular.
      // Al meter la actualización del Signal dentro de zone.run, Angular se enterará
      // inmediatamente de que 'conectado' ahora es true y actualizará la UI (ej. icono verde de conexión).
      this.zone.run(() => {
        this.conectado.set(true);
        console.log("WebSocket conectado");
      });
      this.reenviarPendientes();
    };

    // EVENTO DE RECEPCIÓN DE MENSAJE (EL MÁS IMPORTANTE):
    this.socket.onmessage = (event) => {
      const mensaje = JSON.parse(event.data) as ChatMessage;
      console.log('Mensaje recibido por WebSocket:', event.data);

      // El evento 'onmessage' lo dispara el navegador de forma asíncrona en segundo plano.
      // Sin zone.run, cambias el Signal de mensajes, PERO Angular "está dormido" y no revisa la pantalla.
      // Por eso tenías que salir del chat y volver a entrar (esa interacción obligaba a Angular a despertar).
      //
      // Al envolver el callback dentro de 'this.zone.run(...)':
      // 1. Se ejecuta tu función 'agregarMensajeLocal'.
      // 2. Se actualiza el Signal de mensajes.
      // 3. NgZone despierta a Angular en ese milisegundo y "repinta" la pantalla mostrando el nuevo globo de texto.
      this.zone.run(() => {
        if (this.alRecibirMensajeActual) {
          this.alRecibirMensajeActual(mensaje);
        }
      });
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket cerrado:', event.code, event.reason);
      this.zone.run(() => {
        this.conectado.set(false);
      });
    };

    this.socket.onerror = (error) => {
      console.log('Error WebSocket:', error);
      this.zone.run(() => {
        this.conectado.set(false);
      });
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

    this.zone.run(() => {
      this.conectado.set(false);
    });
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