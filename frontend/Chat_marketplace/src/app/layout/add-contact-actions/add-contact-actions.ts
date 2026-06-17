import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BackButton } from '../../shared/components/back-button/back-button';

@Component({
  selector: 'app-add-contact-controls',
  standalone: true,
  imports: [MatIconModule, BackButton],
  template: `
    <div class="controls-box">

      <div class="top-actions">
        <app-back-button ruta="/chat-contacts" />

        <button class="new-group-btn" type="button" (click)="crearGrupo.emit()">
          <span class="icon-plus">+</span>
          Nuevo grupo
        </button>
      </div>

      <div class="search-box">
        <mat-icon class="search-icon">search</mat-icon>

        <input
          type="text"
          placeholder="Ingrese el nombre o ID de tu amigo."
          [value]="busqueda()"
          (input)="onInput($event)"
        />
      </div>

    </div>
  `,
  styleUrl: './add-contact-actions.scss',
})
export class AddContactControls {
  busqueda = input<string>('');

  busquedaCambiada = output<string>();
  crearGrupo = output<void>();

  onInput(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.busquedaCambiada.emit(input.value);
  }
}