import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PostModelRequest, PostModelResponse } from '../models/post-model';
import { ProductResume } from '../models/product-resume';
import { MarketplaceService } from './marketplace-service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private marketplaceService = inject(MarketplaceService);
  private localStorageService = inject(LocalStorageService);

  private readonly apiUrl = '/api/productos';

  crearPublicacion(post: PostModelRequest, alTerminar?: () => void): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) {
      alert('No hay usuario en sesión.');
      return;
    }

    const formData = new FormData();

    formData.append('usuarioId', usuario.id);
    formData.append('nombre', post.nombre);
    formData.append('descripcion', post.descripcion);
    formData.append('precio', String(post.precio));
    formData.append('unidades', String(post.unidades));
    formData.append('horaDisponible', post.horaDisponible);
    formData.append('puntoEntrega', post.puntoEntrega);
    formData.append('imagen', post.imagen);

    if (post.archivo) {
      formData.append('archivo', post.archivo);
    }

    this.http.post<PostModelResponse>(this.apiUrl, formData)
      .subscribe({
        next: (productoCreado) => {
          const resumen: ProductResume = {
            id: productoCreado.id,
            nombreProducto: productoCreado.nombre,
            precio: productoCreado.precio,
            imagenUrl: productoCreado.imagenUrl,
            estado: this.calcularEstado(productoCreado.unidades),
            piezasRestantes:
              productoCreado.unidades > 0 && productoCreado.unidades <= 5
                ? productoCreado.unidades
                : null,
            likeado: productoCreado.likeado,
            favorito: productoCreado.favorito,
          };

          this.marketplaceService.agregarPublicacion(resumen);

          if (alTerminar) {
            alTerminar();
          }
        },
        error: (error) => {
          console.log('Error creando publicación:', error);
          alert('No se pudo crear la publicación.');
        }
      });
  }

  private calcularEstado(unidades: number): 'disponible' | 'pocas' | 'agotado' {
    if (unidades <= 0) return 'agotado';
    if (unidades <= 5) return 'pocas';
    return 'disponible';
  }
}