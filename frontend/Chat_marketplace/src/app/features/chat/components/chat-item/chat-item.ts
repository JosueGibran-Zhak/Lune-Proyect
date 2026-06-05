import { Component, inject, input } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [],
  template: ` 
  
  <div class="chat-item" matRipple (click)="IrAChatDetallado()">
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
  usuario     = input<string>('Usuario');
  noLeidos    = input<number>(0);

  private redireccionar = inject(Router);

IrAChatDetallado(){
    console.log('Click detectado');
    this.redireccionar.navigate(['/chat-view'])
  }
}
