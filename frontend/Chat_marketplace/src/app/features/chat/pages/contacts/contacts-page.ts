import { Component, inject} from '@angular/core';
import { NavBar } from '../../../../layout/nav-bar/nav-bar';
import { ChatContacts } from '../../../../layout/chat-contacts/chat-contacts';

import { ChatService } from '../../services/chat-service';
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NavBar, ChatContacts],
  templateUrl: './contacts-page.html',
  styleUrl: './contacts-page.scss',
})
export class ContactsPage{
  private chatService = inject(ChatService);
  contacts = this.chatService.contacts;
}
