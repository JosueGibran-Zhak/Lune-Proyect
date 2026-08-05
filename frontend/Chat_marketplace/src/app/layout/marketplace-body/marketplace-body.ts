import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ActionsBar } from '../actions-bar/actions-bar';
import { ProductCard } from '../../features/marketplace/components/product-card/product-card';
import { MarketplaceService } from '../../features/marketplace/services/marketplace-service';

@Component({
  selector: 'app-marketplace-body',
  standalone: true,
  imports: [ProductCard, ActionsBar],
  template: `
    <div class="products-box">
      <div class="products-list">
        @for (producto of marketService.publicaciones(); track producto.id) {
          <app-product-card
            [publicacion]="producto"
            (like)="marketService.alternarLike($event)"
            (favorito)="marketService.alternarFavorito($event)"
          />
        }
      </div>

      <app-actions-bar
        (clickeado)="irCrearPost()"
      />
    </div>
  `,
  styleUrl: './marketplace-body.scss',
})
export class MarketplaceBody implements OnInit {
  marketService = inject(MarketplaceService);

  private router = inject(Router);

  ngOnInit(): void {
    this.marketService.cargarPublicaciones();
  }

  irCrearPost(): void {
    this.router.navigate(['/create-post']);
  }
}