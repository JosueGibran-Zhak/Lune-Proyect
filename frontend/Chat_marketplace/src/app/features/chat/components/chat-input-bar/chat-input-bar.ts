import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-chat-input-bar',
  standalone: true,
  imports: [],
  template:`
    <div class="message-bar">
      <div class="input-wrapper">
        <button class="icon-button" type="button">
          <img src="assets/chat/emoji.png" alt="emoji">
        </button>

        <input
          type="text"
          placeholder="Escribe un mensaje"
          [value]="mensaje()"
          (input)="mensaje.set($any($event.target).value)"
          (keydown.enter)="enviar()"
        >

        <button class="icon-button" type="button">
          <img src="assets/chat/file.png" alt="archivo">
        </button>

        <button class="icon-button" type="button">
          <img src="assets/chat/gallery.png" alt="galería">
        </button>
      </div>

      <button class="send-button" type="button" (click)="enviar()">
        &gt;&gt;
      </button>
    </div>
  `,
  styleUrl: './chat-input-bar.scss',
})
export class ChatInputBar {
  mensajeEnviado = output<string>();
  mensaje = signal('');

  enviar(): void {
    const texto = this.mensaje().trim();

    if (!texto) return;

    this.mensajeEnviado.emit(texto);
    this.mensaje.set('');
  }
}