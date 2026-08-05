import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

import { ProductResume } from '../../models/product-resume';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  publicacion = input.required<ProductResume>();
  router = inject(Router);

  like = output<string>();
  favorito = output<string>();
  verDetalle(): void {
    this.router.navigate(['/product-detail', this.publicacion().id]);
  }
}