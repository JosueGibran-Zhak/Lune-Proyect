import { Component, input, output } from '@angular/core';
import { ChatItem } from '../../features/chat/components/chat-item/chat-item';
import { ActionsBar } from '../actions-bar/actions-bar';
import { ContactItem } from '../../features/chat/models/contact-item';


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
          [usuario]="contact.usuario"
          [noLeidos]="contact.noLeidos"
        />
      }
    </div>
  
    <app-actions-bar
      (clickeado)="onAdd()"
    />
  </div>
  `,
  styleUrl: './chat-contacts.scss',
})
export class ChatContacts {

  contacts = input<ContactItem[]>([]);

  clickeado = output<void>();

  onAdd(): void {
    this.clickeado.emit();
  }
}
