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

  onInput(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.busquedaCambiada.emit(input.value);
  }
}