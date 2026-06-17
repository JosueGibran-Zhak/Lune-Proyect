import { Component,computed,inject } from '@angular/core';
import { ChatService } from '../../features/chat/services/chat-service';
import { ChatMessageItem } from '../../features/chat/components/chat-message-item/chat-message-item';
import { ChatInputBar } from '../../features/chat/components/chat-input-bar/chat-input-bar';

@Component({
  selector: 'app-chat-body',
  standalone:true,
  imports: [ChatMessageItem,ChatInputBar],
  template: ` 
  <section class="chat-body">
      <div class="messages-list">
        @for (mensaje of mensajesActuales(); track mensaje.id) {
          <app-chat-message-item
            [mensaje]="mensaje"
          />
        }
      </div>

      <app-chat-input-bar
        (mensajeEnviado)="enviarMensaje($event)"
      />
    </section>
  `,
  styleUrl: './chat-body.scss',
})
export class ChatBody {
  private chatService = inject(ChatService);

  contactoActual = this.chatService.contactoSeleccionado;

  mensajesActuales = computed(() => {
    const contacto = this.contactoActual();

    if (!contacto) return [];

    return this.chatService.mensajesChat()
      .filter(mensaje => mensaje.contactId === contacto.id);
  });

  enviarMensaje(texto: string): void {
    const contacto = this.contactoActual();

    if (!contacto) return;

    this.chatService.enviarMensaje(contacto.id, texto);
  }
}
