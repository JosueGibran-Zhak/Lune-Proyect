import { Component } from '@angular/core';
import { UserBar } from '../../../../layout/user-bar/user-bar';
import { ChatBody } from '../../../../layout/chat-body/chat-body';

@Component({
  selector: 'app-chat-view-page',
  imports: [UserBar, ChatBody],
  template: `
  <div class="page">
    <app-user-bar
      nombre="Juan"
      avatar="/assets/nav-buttons/usuario.png"
      ruta="/chat"
    />
    <app-chat-body></app-chat-body>
  </div>
  `,
  styleUrl: './chat-view-page.scss',
})
export class ChatViewPage {}
