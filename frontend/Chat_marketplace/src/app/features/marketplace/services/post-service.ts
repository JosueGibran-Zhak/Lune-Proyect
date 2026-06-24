import { Injectable, signal } from '@angular/core';
import { PostModelRequest, PostModelResponse } from '../models/post-model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts = signal<PostModelResponse[]>([]);
  private nextId = 1;

  publicaciones = this.posts.asReadonly();

  crearPublicacion(post: PostModelRequest): void {
    const nuevaPublicacion: PostModelResponse = {
      id: this.nextId++,
      nombre: post.nombre,
      descripcion: post.descripcion,
      precio: post.precio,
      unidades: post.unidades,
      horaDisponible: post.horaDisponible,
      puntoEntrega: post.puntoEntrega,
    };

    this.posts.update(lista => [...lista, nuevaPublicacion]);
  }

  obtenerPublicaciones() {
    return this.publicaciones;
  }
}