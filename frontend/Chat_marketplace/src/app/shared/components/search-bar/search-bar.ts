import { Component,inject,signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { CambioModo } from '../../../core/services/cambio-modo';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  filtrosAbiertos = signal(false);
  modoFiltro = inject(CambioModo);
  
  opciones = [
    'Comida',
    'Bebidas',
    'Ropa',
    'Electrónica',
    'Otros',
    'Más recientes',
    'Mejores valorados',
  ];

  abrirFiltros(): void {
    this.filtrosAbiertos.update(valor => !valor);
  }

  seleccionarFiltro(opcion: string): void {
    this.filtrosAbiertos.set(false);
  }
}
