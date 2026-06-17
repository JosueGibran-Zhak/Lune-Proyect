import { Component } from '@angular/core';
import { BackButton } from '../../shared/components/back-button/back-button';

@Component({
  selector: 'app-create-post-header',
  standalone: true,
  imports: [BackButton],
  template: `
    <header class="header">
      <app-back-button ruta="/marketplace" />
    </header>

    <div class="titulo">
      Crear publicación
    </div>
  `,
  styleUrl: './create-post-header.scss',
})
export class CreatePostHeader {}
