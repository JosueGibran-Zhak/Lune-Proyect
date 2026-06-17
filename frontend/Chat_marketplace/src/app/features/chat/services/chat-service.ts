import { Injectable, signal } from '@angular/core';
import { ContactItem } from '../models/contact-item';
import { UserSearchResult } from '../models/user-search-result';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  contactoSeleccionado = signal<ContactItem | null>(null);
  private nextMessageId = 1;

  //BORRAR DESPUES, Base de datos momentanea para comprobar
  //como se ve en la vista
  readonly contacts = signal<ContactItem[]>([
    { id: 1,  usuario: 'Kenia',      noLeidos: 4 },
    { id: 2,  usuario: 'Genesis',    noLeidos: 1 },
    { id: 3,  usuario: 'Eduardo',    noLeidos: 0 },
    { id: 4,  usuario: 'Josue',      noLeidos: 0 },
    { id: 5,  usuario: 'Abigail',    noLeidos: 0 },
    { id: 6,  usuario: 'Selina',     noLeidos: 0 },
    { id: 7,  usuario: 'David',      noLeidos: 0 },
    { id: 8,  usuario: 'Angel',      noLeidos: 0 },
    { id: 9,  usuario: 'Xcaret',     noLeidos: 0 },
    { id: 10, usuario: 'Fernanda',   noLeidos: 0 },
    { id: 11, usuario: 'Ana Jazmin', noLeidos: 0 },
    { id: 12, usuario: 'Adrian',     noLeidos: 0 },
  ]);

  readonly usuariosDisponibles = signal<UserSearchResult[]>([
    { id: 16, usuario: 'Abigail Navarro', agregado: true },
    { id: 20, usuario: 'Abigail Navarro F.', agregado: false },
    { id: 21, usuario: 'Kenia Martínez', agregado: false },
    { id: 22, usuario: 'Genesis López', agregado: false },
  ]);

  private mensajes = signal<ChatMessage[]>([
    {
      id: 1,
      contactId: 1,
      texto: 'Qué es lo que estas probando?',
      hora: '2:09 p.m.',
      enviadoPorMi: false,
    },
    {
      id: 2,
      contactId: 1,
      texto: 'Este es un texto de prueba para comprobar como se ve la letra.',
      hora: '2:10 p.m.',
      enviadoPorMi: true,
    },
    {
      id: 3,
      contactId: 1,
      texto: 'No sé que es eso.',
      hora: '2:13 p.m.',
      enviadoPorMi: true,
    },
  ]);


  agregarContacto(usuario: UserSearchResult): void {
    const yaExiste = this.contacts().some(contacto => contacto.id === usuario.id);

    if (yaExiste) return;

    this.contacts.update(contactos => [
      ...contactos,
      {
        id: usuario.id,
        usuario: usuario.usuario,
        noLeidos: 0,
        avatarUrl: usuario.avatarUrl,
      }
    ]);

    this.usuariosDisponibles.update(usuarios =>
      usuarios.map(u =>
        u.id === usuario.id
          ? { ...u, agregado: true }
          : u
      )
    );
  }
  

  mensajesChat = this.mensajes.asReadonly();

  enviarMensaje(contactId: number, texto: string): void {
    if (!texto.trim()) return;

    const nuevoMensaje: ChatMessage = {
      id: ++this.nextMessageId,
      contactId,
      texto,
      hora: this.obtenerHoraActual(),
      enviadoPorMi: true,
    };

    this.mensajes.update(lista => [...lista, nuevoMensaje]);
  }

  private obtenerHoraActual(): string {
    return new Date().toLocaleTimeString('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
