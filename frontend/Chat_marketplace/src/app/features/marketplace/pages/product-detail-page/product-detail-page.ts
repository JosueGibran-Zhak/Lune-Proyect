import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailService } from '../../services/product-detail-service';
import { ProductDetailBar } from '../../../../layout/product-detail-bar/product-detail-bar';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [MatIconModule, ProductDetailBar],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productDetailService = inject(ProductDetailService);

  producto = this.productDetailService.producto;
  
  cantidad = this.productDetailService.cantidad;
  total = this.productDetailService.total;
  cargando = this.productDetailService.cargando;
  comprando = this.productDetailService.comprando;
  mensaje = this.productDetailService.mensaje;
  disponible = this.productDetailService.disponible;

  ngOnInit(): void {
    const productoId = this.route.snapshot.paramMap.get('id');

    if (!productoId) {
      this.router.navigate(['/marketplace']);
      return;
    }

    this.productDetailService.cargarProducto(productoId);
  }

  aumentarCantidad(): void {
    this.productDetailService.aumentarCantidad();
  }

  disminuirCantidad(): void {
    this.productDetailService.disminuirCantidad();
  }

  comprar(): void {
    this.productDetailService.comprar();
  }

  enviarMensaje(): void {
    console.log('Después conectamos con chat del vendedor');
  }
}