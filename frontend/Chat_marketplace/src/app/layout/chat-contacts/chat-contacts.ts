import { Component, input, inject } from '@angular/core';
import { ChatItem } from '../../features/chat/components/chat-item/chat-item';
import { ActionsBar } from '../actions-bar/actions-bar';
import { ContactItem } from '../../features/chat/models/contact-item';
import { ChatService } from '../../features/chat/services/chat-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-contacts',
  standalone: true,
  imports: [ChatItem, ActionsBar],
  template: `
    <div class="contacts-box">
      @if (contacts().length > 0) {
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
      } @else {
        <section class="empty-contacts">
          <div class="empty-center">
            <h1>¡Bienvenido!</h1>
            <p>Agrega a alguien para empezar a chatear.</p>
          </div>

          <div class="empty-hint">
            <p>Agrega a tus amigos.</p>
          </div>
        </section>
      }

      <app-actions-bar
        (clickeado)="irAgregarContacto()"
      />
    </div>
  `,
  styleUrl: './chat-contacts.scss',
})
export class ChatContacts {
  contacts = input<ContactItem[]>([]);

  private chatService = inject(ChatService);
  private router = inject(Router);

  ngOnInit(): void {
    // Al cargar la lista de contactos, nos aseguramos de que no haya ningún chat activo en memoria
    this.chatService.limpiarContactoSeleccionado();
  }

  irAgregarContacto(): void {
    this.router.navigate(['/add-contact']);
  }

  irAChat(id: string): void {
    const contacto = this.contacts().find(c => c.id === id);

    if (!contacto) return;

    this.chatService.seleccionarContacto(contacto);
    this.router.navigate(['/chat-view']);
  }
}