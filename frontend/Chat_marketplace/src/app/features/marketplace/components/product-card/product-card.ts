import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
}
