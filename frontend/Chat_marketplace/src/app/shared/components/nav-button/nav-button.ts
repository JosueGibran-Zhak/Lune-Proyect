import { Component, inject, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CambioModo } from '../../../core/services/cambio-modo';

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

  modo = inject(CambioModo);


  //BORRAR DESPUES
  private router = inject(Router);

  navegar(): void{
    const rutaRedireccion = this.rutaRedireccion();

    if(rutaRedireccion.includes('chat')){
      this.modo.mostrarSearchChat();
    }
    if(rutaRedireccion.includes('marketplace')){
      this.modo.mostrarSearchMarketplace();
    }

    this.router.navigate([rutaRedireccion]);
  }
}
