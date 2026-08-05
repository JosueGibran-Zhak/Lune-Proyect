import { Component } from '@angular/core';
import { BackButton } from '../../shared/components/back-button/back-button';
import { NavButton } from '../../shared/components/nav-button/nav-button';

@Component({
  selector: 'app-product-detail-bar',
  imports: [BackButton,NavButton],
  template: `
  <div class="container-bar">
      <app-back-button 
        ruta="/marketplace">
      </app-back-button>

      <div class="nav-buttons">
        <app-nav-button icono="./assets/nav-buttons/chat.png" rutaRedireccion="chat-contacts"/>
        <app-nav-button icono="./assets/nav-buttons/corazon.png" rutaRedireccion="favoritos"/>
      </div>
    </div>
  `,
  styleUrl: './product-detail-bar.scss',
})
export class ProductDetailBar {}
