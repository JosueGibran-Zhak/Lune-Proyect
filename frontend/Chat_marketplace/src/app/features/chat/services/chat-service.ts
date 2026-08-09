import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ContactItem } from '../models/contact-item';
import { UserSearchResult } from '../models/user-search-result';
import { ChatMessage } from '../models/chat-message';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { WebSocketsService } from './web-sockets-service';
import { ListKeyManager } from '@angular/cdk/a11y';

/**
 * Servicio centralizado para la gestión del chat real-time, contactos y mensajes.
 * Utiliza Angular Signals para un manejo de estado reactivo y fino.
 */
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Inyección de dependencias mediante la API moderna inject()
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private webSocketsService = inject(WebSocketsService);

  // Endpoints base de la API REST
  private readonly contactosApiUrl = '/api/contactos';
  private readonly mensajesApiUrl = '/api/mensajes';

  // State Management: Estado del contacto activo en la conversación
  contactoSeleccionado = signal<ContactItem | null>(null);

  // State Management: Lista privada de contactos y su exposición pública como Readonly
  private contactsSignal = signal<ContactItem[]>([]);
  contacts = this.contactsSignal.asReadonly();

  // State Management: Lista de usuarios devueltos por la búsqueda
  usuariosDisponibles = signal<UserSearchResult[]>([]);

  // Banderas reactivas para estados de carga en la UI
  cargandoContactos = signal(false);
  cargandoBusqueda = signal(false);

  // State Management: Flujo de mensajes del chat actual
  private mensajes = signal<ChatMessage[]>([]);
  mensajesChat = this.mensajes.asReadonly();

  /**
   * Genera un UUID v4 de forma segura.
   * Utiliza la API nativa crypto.randomUUID() si está disponible, 
   * o implementa un fallback seguro para entornos HTTP en red local (192.168.x.x).
   */
  private generarUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Método seguro para verificar e iniciar la conexión cuando se necesite
  /**
   * Verifica la sesión local e inicia la conexión WebSocket si existe un usuario activo.
   * Regista el callback para la recepción de mensajes entrantes.
   */
  asegurarConexionWebSocket(): boolean {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;
    if (usuario) {
      this.webSocketsService.conectar(usuario.id, (mensaje) => {
        this.agregarMensajeLocal(mensaje);
      });
      return true;
    }
    return false;
  }

  /**
   * Obtiene la lista de contactos del usuario autenticado desde el servidor HTTP.
   */
  cargarContactos(): void {
    // Conectamos/Aseguramos WebSocket al cargar contactos
    this.asegurarConexionWebSocket();

    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    this.cargandoContactos.set(true);

    this.http.get<ContactItem[]>(`${this.contactosApiUrl}/${usuario.id}`)
      .subscribe({
        next: (contactos) => {
          this.contactsSignal.set(contactos);
          this.cargandoContactos.set(false);
        },
        error: (error) => {
          console.log('Error cargando contactos:', error);
          this.cargandoContactos.set(false);
        }
      });
  }

  /**
   * Realiza una búsqueda de usuarios en la API filtrando por coincidencia de texto.
   * @param texto Cadena de texto a buscar en el backend.
   */
  buscarUsuarios(texto: string): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    const busqueda = texto.trim();

    // Limpia el estado si la búsqueda está vacía
    if (!busqueda) {
      this.usuariosDisponibles.set([]);
      return;
    }

    this.http.get<UserSearchResult[]>(`${this.contactosApiUrl}/buscar/${usuario.id}/${busqueda}`)
      .subscribe({
        next: (usuarios) => {
          this.usuariosDisponibles.set(usuarios);
        },
        error: (error) => {
          console.log('Error buscando usuarios:', error);
        }
      });
  }

  /**
   * Envía una solicitud para añadir un nuevo usuario a la lista de contactos.
   * @param usuarioBuscado Objeto del usuario seleccionado de la búsqueda.
   */
  agregarContacto(usuarioBuscado: UserSearchResult): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    if (usuarioBuscado.agregado) return;

    this.http.post<ContactItem>(`${this.contactosApiUrl}/${usuario.id}/${usuarioBuscado.id}`, {})
      .subscribe({
        next: (nuevoContacto) => {
          // Actualización inmutable de la lista de contactos agregando el nuevo elemento
          this.contactsSignal.update(contactos => [...contactos, nuevoContacto]);

          // Marca al usuario como agregado localmente en el resultado de búsqueda
          this.usuariosDisponibles.update(usuarios =>
            usuarios.map(u =>
              u.id === usuarioBuscado.id
                ? { ...u, agregado: true }
                : u
            )
          );
        },
        error: (error) => {
          console.log('Error agregando contacto:', error);
        }
      });
  }

  /**
   * Establece un contacto activo en la UI y dispara la carga de su historial.
   * @param contacto Objeto ContactItem seleccionado.
   */
  seleccionarContacto(contacto: ContactItem): void {
    this.contactoSeleccionado.set(contacto);
    
    // Reiniciar contador de no leídos para este contacto localmente
    const idDestino = contacto.contactoId || (contacto as any).id;
    
    this.contactsSignal.update(contactos =>
      contactos.map(c => {
        const id = c.contactoId || c.id;
        if (id === idDestino) {
          return { ...c, noLeidos: 0 };
        }
        return c;
      })
    );

    if (idDestino) {
      this.cargarMensajesContacto(idDestino);
    }
  }

  /**
   * Solicita al servidor el historial de mensajes entre el usuario logueado y el contacto especificado.
   * @param contactoId Identificador único del destinatario.
   */
  cargarMensajesContacto(contactoId: string): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    this.http.get<ChatMessage[]>(`${this.mensajesApiUrl}/${usuario.id}/${contactoId}`)
      .subscribe({
        next: (mensajes) => {
          this.mensajes.set(mensajes);
          this.bajarScrollMensajes();
        },
        error: (error) => {
          console.log('Error cargando mensajes:', error);
        }
      });
  }

  /**
   * Crea, agrega de forma optimista y transmite un nuevo mensaje vía WebSocket.
   * @param contactoId ID del usuario receptor.
   * @param texto Contenido textual del mensaje.
   */
  enviarMensaje(contactoId: string, texto: string): void {
    // Nos aseguramos de que el socket esté conectado antes de enviar mensaje
    this.asegurarConexionWebSocket();
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    const contenido = texto.trim();

    if (!contenido) return;

    // Construcción de la entidad ChatMessage con UUID único usando la función segura
    const nuevoMensaje: ChatMessage = {
      id: this.generarUUID(),
      emisorId: usuario.id,
      receptorId: contactoId,
      texto: contenido,
      tipo: 'texto',
      archivoUrl: '',
      fecha: new Date().toISOString(),
      estado: 'enviado'
    };

    // Renderizado optimista en la interfaz local
    this.agregarMensajeLocal(nuevoMensaje);

    // Envío en tiempo real mediante el WebSocketsService
    this.webSocketsService.enviarMensaje(nuevoMensaje);
  }

  /**
   * Agrega un mensaje al Signal o actualiza sus propiedades si ya existe (idempotencia).
   * @param mensaje Estructura ChatMessage recibida o generada.
   */
  private agregarMensajeLocal(mensaje: ChatMessage): void {
    const usuarioActual = this.localStorageService.obtenerSesion()?.usuario;
    const contactoActivo = this.contactoSeleccionado();

    if (!usuarioActual) return;

    // Obtener el ID del contacto con el que estás hablando actualmente
    const idContactoActivo = contactoActivo 
      ? (contactoActivo.contactoId || contactoActivo.id) 
      : null;

    // Un mensaje pertenece al chat activo si:
    // 1. El emisor es el contacto activo Y el receptor eres tú.
    // 2. El emisor eres tú Y el receptor es el contacto activo.
    const esDelChatActivo = idContactoActivo && (
      (mensaje.emisorId === idContactoActivo && mensaje.receptorId === usuarioActual.id) ||
      (mensaje.emisorId === usuarioActual.id && mensaje.receptorId === idContactoActivo)
    );

    // 1. Actualización de la pantalla de mensajes del chat
    if (esDelChatActivo) {
      const existe = this.mensajes().some(item => item.id === mensaje.id);
      
      if (existe) {
        this.mensajes.update(lista =>
          lista.map(item => item.id === mensaje.id ? { ...item, ...mensaje } : item)
        );
      } else {
        this.mensajes.update(lista => [...lista, mensaje]);
      }
      this.bajarScrollMensajes();
    }

    // 2. Actualización de contadores 'noLeidos' en la lista de contactos
    // Solo si el mensaje lo envió otra persona y NO tienes abierta la conversación con esa persona
    const esMensajeRecibido = mensaje.emisorId !== usuarioActual.id;
    
    if (esMensajeRecibido) {
      this.contactsSignal.update(contactos =>
        contactos.map(c => {
          const idContacto = c.contactoId || c.id;
          
          if (idContacto === mensaje.emisorId) {
            // Si el chat con este emisor NO está abierto actualmente, sumamos a noLeidos
            const estaChatAbierto = idContactoActivo === mensaje.emisorId;
            return {
              ...c,
              noLeidos: estaChatAbierto ? 0 : (c.noLeidos ?? 0) + 1
            };
          }
          return c;
        })
      );
    }
  }

  //Limpiar la sesion del contacto seleccionado
  limpiarContactoSeleccionado(): void {
    this.contactoSeleccionado.set(null);
  }

  /**
   * Desplaza el scroll del contenedor principal de la vista hasta el final para mostrar el mensaje más reciente.
   */
  private bajarScrollMensajes(): void {
    // Usamos requestAnimationFrame + setTimeout para dar tiempo suficiente a Angular de pintar los nodos en el DOM
    setTimeout(() => {
      requestAnimationFrame(() => {
        const contenedor = document.getElementById('messages-list');

        if (!contenedor) return;

        contenedor.scrollTo({
          top: contenedor.scrollHeight,
          behavior: 'instant' // 'smooth' para una animacion suave
        });
      });
    }, 50);
  }
}