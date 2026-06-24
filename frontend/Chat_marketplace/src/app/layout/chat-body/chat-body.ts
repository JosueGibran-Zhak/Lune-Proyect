import { Component, OnInit, computed, inject } from '@angular/core';
import { ChatService } from '../../features/chat/services/chat-service';
import { ChatMessageItem } from '../../features/chat/components/chat-message-item/chat-message-item';
import { ChatInputBar } from '../../features/chat/components/chat-input-bar/chat-input-bar';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-chat-body',
  standalone: true,
  imports: [ChatMessageItem, ChatInputBar],
  template: ` 
    <section class="chat-body">
      <div class="messages-list" id="messages-list">
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
export class ChatBody implements OnInit{
  private chatService = inject(ChatService);
  private localStorageService = inject(LocalStorageService);

  contactoActual = this.chatService.contactoSeleccionado;

  mensajesActuales = computed(() => {
    const contacto = this.contactoActual();
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!contacto || !usuario) return [];

    return this.chatService.mensajesChat()
      .filter(mensaje =>
        (mensaje.emisorId === usuario.id && mensaje.receptorId === contacto.contactoId) ||
        (mensaje.emisorId === contacto.contactoId && mensaje.receptorId === usuario.id)
      );
  });

  ngOnInit(): void {
    const contacto = this.contactoActual();

    if (!contacto) return;

    this.chatService.iniciarChatTiempoReal();
    this.chatService.cargarMensajesContacto(contacto.contactoId);
  }

  ngOnDestroy(): void {
    this.chatService.detenerChatTiempoReal();
  }

  enviarMensaje(texto: string): void {
    const contacto = this.contactoActual();

    if (!contacto) return;

    this.chatService.enviarMensaje(contacto.contactoId, texto);
  }
}