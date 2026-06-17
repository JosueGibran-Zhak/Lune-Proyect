import { Component, input, inject } from '@angular/core';
import { ChatItem } from '../../features/chat/components/chat-item/chat-item';
import { ActionsBar } from '../actions-bar/actions-bar';
import { ContactItem } from '../../features/chat/models/contact-item';
import { ChatService } from '../../features/chat/services/chat-service';

import { Router } from '@angular/router';


//Es la estructura para mostrar la lista de todos los contactos registrados
@Component({
  selector: 'app-chat-contacts',
  standalone: true,
  imports: [ChatItem, ActionsBar],
  template: `
  <div class="contacts-box">
    <div class="contacts-list">
      @for (contact of contacts(); track contact.id) {
        <app-chat-item
          [id]="contact.id"
          [usuario]="contact.usuario"
          [noLeidos]="contact.noLeidos"
          (seleccionado)="irAChat(contact.id)"
        />  
      }
    </div>

    <app-actions-bar
      (clickeado)="irAgregarContacto()"
    />
  </div>
  `,
  styleUrl: './chat-contacts.scss',
})
export class ChatContacts {

  contacts = input<ContactItem[]>([]);
  chatService = inject(ChatService);

  private router = inject(Router);

  irAgregarContacto(): void {
    this.router.navigate(['/add-contact']);
  }
  irAChat(id: number): void {
    const contacto = this.contacts().find(c => c.id === id);

    if (!contacto) return;

    this.chatService.contactoSeleccionado.set(contacto);
    this.router.navigate(['/chat-view']);
  }
}
