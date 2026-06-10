import { Injectable, signal } from '@angular/core';
import { ProductResume } from '../models/product-resume';


@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  readonly publicaciones = signal<ProductResume[]>([
    { id: 1, nombreProducto: 'Gomitas azucaradas', precio: 15,  imagenUrl: 'assets/productos/gomitas.jpg',    estado: 'disponible',               likeado: false, favorito: false },
    { id: 2, nombreProducto: 'Pines',              precio: 50,  imagenUrl: 'assets/productos/pines.jpg',      estado: 'pocas', piezasRestantes: 5, likeado: false, favorito: false },
    { id: 3, nombreProducto: 'Gloss',              precio: 250, imagenUrl: 'assets/productos/gloss.jpg',      estado: 'agotado',                  likeado: false, favorito: false },
    { id: 4, nombreProducto: 'Nachos',             precio: 30,  imagenUrl: 'assets/productos/nachos.jpg',     estado: 'disponible',               likeado: false, favorito: false },
    { id: 5, nombreProducto: 'Hot-dog',            precio: 20,  imagenUrl: 'assets/productos/hotdog.jpg',     estado: 'pocas', piezasRestantes: 3, likeado: false, favorito: false },
    { id: 6, nombreProducto: 'Gel antibacterial',  precio: 80,  imagenUrl: 'assets/productos/gel.jpg',        estado: 'disponible',               likeado: false, favorito: false },
  ])

}
