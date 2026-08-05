import { Component, computed, inject, ChangeDetectorRef } from '@angular/core';
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
export class ChatBody {
  // Inyección de servicios usando el estándar moderno inject()
  private chatService = inject(ChatService);
  private localStorageService = inject(LocalStorageService);
  
  // INYECCIÓN DEL DETECTOR DE CAMBIOS:
  // Herramienta moderna de Angular para forzar la actualización del DOM cuando los Signals cambian por eventos de red.
  private cdr = inject(ChangeDetectorRef);

  contactoActual = this.chatService.contactoSeleccionado;

  mensajesActuales = computed(() => {
    const contacto = this.contactoActual();
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!contacto || !usuario) return [];

    // Extracción segura del ID (soporta tanto .contactoId como .id si el objeto cambia)
    const idDestinatario = contacto.contactoId || (contacto as any).id;

    // Filtramos el Signal de mensajes guardados
    const mensajesFiltrados = this.chatService.mensajesChat().filter(
      (mensaje) =>
        (mensaje.emisorId === usuario.id && mensaje.receptorId === idDestinatario) ||
        (mensaje.emisorId === idDestinatario && mensaje.receptorId === usuario.id)
    );

    // MARCAR PARA REVISIÓN:
    // Le avisa al motor de renderizado de Angular que el listado de este componente cambió
    // y debe repintarse inmediatamente en pantalla.
    this.cdr.markForCheck();

    return mensajesFiltrados;
  });

  enviarMensaje(texto: string): void {
    const contacto = this.contactoActual();

    if (!contacto) return;

    // Aseguramos que nunca se envíe 'undefined' al backend
    const idDestinatario = contacto.contactoId || (contacto as any).id;

    if (idDestinatario) {
      this.chatService.enviarMensaje(idDestinatario, texto);
    }
  }
}