import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ContactItem } from '../models/contact-item';
import { UserSearchResult } from '../models/user-search-result';
import { ChatMessage } from '../models/chat-message';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { WebSocketsService } from './web-sockets-service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private webSocketsService = inject(WebSocketsService);

  private readonly contactosApiUrl = '/api/contactos';
  private readonly mensajesApiUrl = '/api/mensajes';

  contactoSeleccionado = signal<ContactItem | null>(null);

  private contactsSignal = signal<ContactItem[]>([]);
  contacts = this.contactsSignal.asReadonly();

  usuariosDisponibles = signal<UserSearchResult[]>([]);

  cargandoContactos = signal(false);
  cargandoBusqueda = signal(false);

  private mensajes = signal<ChatMessage[]>([]);
  mensajesChat = this.mensajes.asReadonly();

  cargarContactos(): void {
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

  buscarUsuarios(texto: string): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    const busqueda = texto.trim();

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

  agregarContacto(usuarioBuscado: UserSearchResult): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    if (usuarioBuscado.agregado) return;

    this.http.post<ContactItem>(`${this.contactosApiUrl}/${usuario.id}/${usuarioBuscado.id}`, {})
      .subscribe({
        next: (nuevoContacto) => {
          this.contactsSignal.update(contactos => [...contactos, nuevoContacto]);

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

  seleccionarContacto(contacto: ContactItem): void {
    this.contactoSeleccionado.set(contacto);
  }

  iniciarChatTiempoReal(): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    this.webSocketsService.conectar(
      usuario.id,
      (mensaje) => this.agregarMensajeLocal(mensaje)
    );
  }

  detenerChatTiempoReal(): void {
    this.webSocketsService.desconectar();
  }

  cargarMensajesContacto(contactoId: string): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    this.http.get<ChatMessage[]>(`${this.mensajesApiUrl}/${usuario.id}/${contactoId}`)
      .subscribe({
        next: (mensajes) => {
          this.mensajes.set(mensajes);
        },
        error: (error) => {
          console.log('Error cargando mensajes:', error);
        }
      });
  }

  enviarMensaje(contactoId: string, texto: string): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) return;

    const contenido = texto.trim();

    if (!contenido) return;

    const nuevoMensaje: ChatMessage = {
      id: crypto.randomUUID(),
      emisorId: usuario.id,
      receptorId: contactoId,
      texto: contenido,
      tipo: 'texto',
      archivoUrl: '',
      fecha: new Date().toISOString(),
      estado: 'enviado'
    };

    this.agregarMensajeLocal(nuevoMensaje);

    this.webSocketsService.enviarMensaje(nuevoMensaje);
  }

  private agregarMensajeLocal(mensaje: ChatMessage): void {
    const existe = this.mensajes().some(item => item.id === mensaje.id);

    if (existe) {
      this.mensajes.update(lista =>
        lista.map(item =>
          item.id === mensaje.id
            ? { ...item, ...mensaje }
            : item
        )
      );

      this.bajarScrollMensajes();
      return;
    }

    this.mensajes.update(lista => [...lista, mensaje]);
    this.bajarScrollMensajes();
  }

  private bajarScrollMensajes(): void {
    setTimeout(() => {
      const contenedor = document.getElementById('messages-list');

      if (!contenedor) return;

      contenedor.scrollTop = contenedor.scrollHeight;
    });
  }
}