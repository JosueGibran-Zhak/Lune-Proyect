import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-button',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './nav-button.html',
  styleUrl: './nav-button.scss',
})
export class NavButton {
  /*Signal para obtener la ruta del icono(imagen)*/
  icono = input.required<string>();

  /*Signal para obtener la ruta de redirección como string */
  rutaRedireccion= input.required<string>();

  //BORRAR DESPUES
  private router = inject(Router);
  navegar(): void{
    this.router.navigate([this.rutaRedireccion()]);
  }
}
