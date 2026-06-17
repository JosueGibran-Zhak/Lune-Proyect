import { Component,input} from '@angular/core';
import { NavButton } from '../../shared/components/nav-button/nav-button';
import { BackButton } from '../../shared/components/back-button/back-button';

@Component({
  selector: 'app-user-bar',
  imports: [NavButton, BackButton],
  template: `
    <div class="container-bar">
      <app-back-button 
        ruta="/chat-contacts">
      </app-back-button>

        <div class="user-content">
          <app-nav-button
            [icono]="avatar()"
            rutaRedireccion="/usuario"
            onclick="navegar()"
          />
          <span class="user-name">
            {{ nombre() }}
          </span>
        </div>

    </div>
  `,
  styleUrl: './user-bar.scss',
})
export class UserBar {

  nombre = input.required<string>();
  avatar = input.required<string>();

}
