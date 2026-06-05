import { Component, inject} from '@angular/core';
import { NavBar } from '../../../../layout/nav-bar/nav-bar';
import { ChatContacts } from '../../../../layout/chat-contacts/chat-contacts';

import { Router } from '@angular/router';

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
  
  //ngOnInit(): void {
  //  this.chatService.loadContacts();
  //}

  onAddContact(): void {
    
  }
  //BORRAR DESPUES LA VARIABLE
  private router = inject(Router);
  cambiarAMarketplace(){
    //BORRAR DESPUES Y CAMBIARLO POR LOS SERVICIOS
    this.router.navigate(['/marketplace']);
  }
}
