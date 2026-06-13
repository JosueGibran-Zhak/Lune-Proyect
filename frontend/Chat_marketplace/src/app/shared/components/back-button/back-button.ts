import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatButtonModule],
  template: `
  <button mat-button class="container-btn" type="button" (click)="navegar()">
    <div class="back-icon">
      <img src="assets/nav-buttons/back.svg">
    </div>
  </button>
  `,
  styleUrl: './back-button.scss',
})
export class BackButton {
  private router = inject(Router);
  ruta = input.required<string>();

  navegar(): void {
    this.router.navigate([this.ruta()]);
  }
}
