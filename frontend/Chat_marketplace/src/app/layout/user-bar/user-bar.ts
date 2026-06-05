import { Component,input,inject } from '@angular/core';
import { NavButton } from '../../shared/components/nav-button/nav-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bar',
  imports: [NavButton],
  template: ` 
    <div class="container-bar">

      <button
          class="user-content"
          type="button"
          (click)="navegar()">

      <!--CAMBIAR DESPUES LA RUTA AL AHCER LO DE USUARIOS-->
          <app-nav-button
            icono="/assets/nav-buttons/usuario.png" 
            rutaRedireccion="/usuario"
          />

          <span class="user-name">
              {{ nombre() }}
          </span>

      </button>
  </div>
  `,
  styleUrl: './user-bar.scss',
})
export class UserBar {

  nombre = input.required<string>();
  avatar = input.required<string>();
  ruta = input.required<string>();

  private router = inject(Router);

  navegar(): void {
    this.router.navigate([this.ruta()]);
  }
}
