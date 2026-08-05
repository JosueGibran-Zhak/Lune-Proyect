import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductResume } from '../models/product-resume';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/productos';

  private publicacionesSignal = signal<ProductResume[]>([]);
  publicaciones = this.publicacionesSignal.asReadonly();

  cargando = signal(false);

  cargarPublicaciones(): void {
    this.cargando.set(true);

    this.http.get<ProductResume[]>(this.apiUrl)
      .subscribe({
        next: (productos) => {
          this.publicacionesSignal.set(
            productos.map(producto => this.normalizarImagen(producto))
          );

          this.cargando.set(false);
        },
        error: (error) => {
          console.log('Error cargando productos:', error);
          this.cargando.set(false);
        }
      });
  }

  alternarLike(productoId: string): void {
    this.http.patch<ProductResume>(`${this.apiUrl}/${productoId}/like`, {})
      .subscribe({
        next: (productoActualizado) => {
          this.actualizarProducto(productoActualizado);
        },
        error: (error) => {
          console.log('Error actualizando like:', error);
        }
      });
  }

  alternarFavorito(productoId: string): void {
    this.http.patch<ProductResume>(`${this.apiUrl}/${productoId}/favorito`, {})
      .subscribe({
        next: (productoActualizado) => {
          this.actualizarProducto(productoActualizado);
        },
        error: (error) => {
          console.log('Error actualizando favorito:', error);
        }
      });
  }

  agregarPublicacion(producto: ProductResume): void {
    const productoNormalizado = this.normalizarImagen(producto);

    this.publicacionesSignal.update(lista => [
      productoNormalizado,
      ...lista
    ]);
  }

  private actualizarProducto(productoActualizado: ProductResume): void {
    const productoNormalizado = this.normalizarImagen(productoActualizado);

    this.publicacionesSignal.update(lista =>
      lista.map(producto =>
        producto.id === productoNormalizado.id
          ? productoNormalizado
          : producto
      )
    );
  }

  private normalizarImagen(producto: ProductResume): ProductResume {
    return {
      ...producto,
      imagenUrl: this.obtenerUrlArchivo(producto.imagenUrl),
    };
  }

  private obtenerUrlArchivo(url: string): string {
    if (url.startsWith('/uploads')) {
      return `http://${window.location.hostname}:8000${url}`;
    }

    return url;
  }
}