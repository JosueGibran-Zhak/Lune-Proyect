import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [],
  template: `
  <button class= "secondary-btn"
    type="button"
    matRipple
    (click)="onClick()"
  >
  <img src="assets/action-buttons/add.png" class="btn-icon">
  </button> 
  `,
  styleUrl: './add-button.scss',
})
export class AddButton {

  clickeado = output<void>();

  onClick(): void {
    this.clickeado.emit();
  }
}
