import { Component, input } from '@angular/core';
import { ChatMessage } from '../../models/chat-message';

@Component({
  selector: 'app-chat-message-item',
  standalone: true,
  imports: [],
  template: `
    <div
      class="message-row"
      [class.mine]="mensaje().enviadoPorMi"
    >
      <div class="message-bubble">
        <p>{{ mensaje().texto }}</p>
        <span>{{ mensaje().hora }}</span>
      </div>
    </div>
  `,
  styleUrl: './chat-message-item.scss',
})
export class ChatMessageItem {
  mensaje = input.required<ChatMessage>();
}