import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProductDetail, ComprarProductoRequest } from '../models/product-detail';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/productos';

  private productoSignal = signal<ProductDetail | null>(null);
  producto = this.productoSignal.asReadonly();

  cantidad = signal(1);
  cargando = signal(false);
  comprando = signal(false);
  mensaje = signal('');
  imagenUrl = signal('');

  disponible = computed(() => {
    const producto = this.productoSignal();
    return !!producto && producto.unidades > 0;
  });

  total = computed(() => {
    const producto = this.productoSignal();

    if (!producto) return 0;

    return producto.precio * this.cantidad();
  });

  cargarProducto(productoId: string): void {
    this.cargando.set(true);
    this.mensaje.set('');

    this.http.get<ProductDetail>(`${this.apiUrl}/${productoId}`)
      .subscribe({
        next: (producto) => {
console.log(producto.imagenUrl);

          this.productoSignal.set(producto);
          this.cantidad.set(producto.unidades > 0 ? 1 : 0);
          this.cargando.set(false);
        },
        error: (error) => {
          console.log('Error cargando producto:', error);
          this.cargando.set(false);
        }
      });
  }

  aumentarCantidad(): void {
    const producto = this.productoSignal();

    if (!producto) return;

    if (this.cantidad() < producto.unidades) {
      this.cantidad.update(valor => valor + 1);
    }
  }

  disminuirCantidad(): void {
    if (this.cantidad() > 1) {
      this.cantidad.update(valor => valor - 1);
    }
  }

  comprar(): void {
    const producto = this.productoSignal();

    if (!producto) return;

    if (this.cantidad() <= 0) return;

    const datos: ComprarProductoRequest = {
      cantidad: this.cantidad()
    };

    this.comprando.set(true);
    this.mensaje.set('');

    this.http.patch<ProductDetail>(`${this.apiUrl}/${producto.id}/comprar`, datos)
      .subscribe({
        next: (productoActualizado) => {
          this.productoSignal.set(productoActualizado);
          this.cantidad.set(productoActualizado.unidades > 0 ? 1 : 0);
          this.comprando.set(false);
          this.mensaje.set('Compra realizada correctamente.');
        },
        error: (error) => {
          console.log('Error comprando:', error);
          this.comprando.set(false);
          this.mensaje.set('No se pudo realizar la compra.');
        }
      });
  }
}