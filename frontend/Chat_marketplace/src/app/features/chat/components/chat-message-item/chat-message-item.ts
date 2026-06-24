import { Component, computed, inject, input } from '@angular/core';
import { ChatMessage } from '../../models/chat-message';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Component({
  selector: 'app-chat-message-item',
  standalone: true,
  imports: [],
  template: `
    <div
      class="message-row"
      [class.mine]="enviadoPorMi()"
    >
      <div
        class="message-bubble"
        [class.pending]="mensaje().estado === 'pendiente'"
      >
        <p>{{ mensaje().texto }}</p>
        <span>{{ horaMensaje() }}</span>

        @if (mensaje().estado === 'pendiente') {
          <small>Pendiente</small>
        }
      </div>
    </div>
  `,
  styleUrl: './chat-message-item.scss',
})
export class ChatMessageItem {
  private localStorageService = inject(LocalStorageService);

  mensaje = input.required<ChatMessage>();

  enviadoPorMi = computed(() => {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;
    if (!usuario) return false;

    return this.mensaje().emisorId === usuario.id;
  });

  horaMensaje = computed(() => {
    return new Date(this.mensaje().fecha).toLocaleTimeString('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
    });
  });
}