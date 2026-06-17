import { Component, computed, inject } from '@angular/core';
import { UserBar } from '../../../../layout/user-bar/user-bar';
import { ChatBody } from '../../../../layout/chat-body/chat-body';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-chat-view-page',
  imports: [UserBar, ChatBody],
  template: `
  <div class="page">
    <app-user-bar
      [nombre]="nombreUsuario()"
      avatar="/assets/nav-buttons/usuario.png"
    />
    <app-chat-body></app-chat-body>
  </div>
  `,
  styleUrl: './chat-view-page.scss',
})
export class ChatViewPage {
    chatService = inject(ChatService);

    contactoActual = this.chatService.contactoSeleccionado;

    nombreUsuario = computed(() =>
      this.contactoActual()?.usuario ?? 'Usuario'
    );
}
