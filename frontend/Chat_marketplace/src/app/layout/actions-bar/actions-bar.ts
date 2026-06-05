import { Component, output } from '@angular/core';
import { AddButton } from '../../shared/components/add-button/add-button';

@Component({
  selector: 'app-actions-bar',
  standalone: true,
  imports: [AddButton],
  template: `

  <div class="add-bar">
    <app-add-button
      (clicked)="onAdd()"
    />
  </div>
`,
  styleUrl: './actions-bar.scss',
})
export class ActionsBar {

  clickeado = output<void>();

  onAdd(): void {
    this.clickeado.emit();
  }
}
