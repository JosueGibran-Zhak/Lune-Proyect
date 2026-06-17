import { Component,input, output } from '@angular/core';

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [],
  template: ` 
  
  <div class="chat-item" (click)="seleccionarContacto()">
      <div class="avatar">
        <img src="assets/nav-buttons/usuario.png" [alt]="usuario()" class="avatar-img" />
      </div>

      <span class="usuario">{{ usuario() }}</span>
    
      @if (noLeidos() > 0) {
        <span class="noLeidos">{{ noLeidos() }}</span>
      }
    </div>
  `,
  styleUrl: './chat-item.scss',
})
export class ChatItem {
  id          = input.required<number>();  
  usuario     = input<string>('Usuario');
  noLeidos    = input<number>(0);

  seleccionado = output<number>();

  seleccionarContacto(): void {
    this.seleccionado.emit(this.id());
  }
}
