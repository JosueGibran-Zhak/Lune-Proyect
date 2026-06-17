import { Component,inject } from '@angular/core';
import { ActionsBar } from '../actions-bar/actions-bar';
import { ProductCard } from '../../features/marketplace/components/product-card/product-card';
import { MarketplaceService } from '../../features/marketplace/services/marketplace-service';

@Component({
  selector: 'app-marketplace-body',
  standalone: true,
  imports: [ProductCard,ActionsBar],
  template: `
  <div class="products-box">
    <div class="products-list">
      @for (producto of marketService.publicaciones(); track producto.id) {
        <app-product-card
            [publicacion]="producto"
          >
        </app-product-card>
      }
    </div>

    <app-actions-bar
      
    />
  </div>
  `,
  styleUrl: './marketplace-body.scss',
})
export class MarketplaceBody {

  marketService = inject(MarketplaceService);
}
