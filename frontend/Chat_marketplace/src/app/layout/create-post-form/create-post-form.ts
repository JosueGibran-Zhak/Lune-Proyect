import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PostService } from '../../features/marketplace/services/post-service';
import { PostModelRequest } from '../../features/marketplace/models/post-model';
@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [],
  templateUrl: './create-post-form.html',
  styleUrl: './create-post-form.scss',
})
export class CreatePostForm {
  private router = inject(Router);
  private postService = inject(PostService);

  nombre = signal('');
  descripcion = signal('');

  precio = signal(0);
  unidades = signal(0);

  horaDisponible = signal('');
  puntoEntrega = signal('');

  telefono = signal('');
  instagram = signal('');
  facebook = signal('');
  tiktok = signal('');

  imagen = signal<File | null>(null);
  archivo = signal<File | null>(null);

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.imagen.set(input.files[0]);
    }
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.archivo.set(input.files[0]);
    }
  }

  crearPublicacion(): void {
    const publicacion: PostModelRequest = {
      nombre: this.nombre(),
      descripcion: this.descripcion(),
      precio: this.precio(),
      unidades: this.unidades(),
      horaDisponible: this.horaDisponible(),
      puntoEntrega: this.puntoEntrega(),
    };

    this.postService.crearPublicacion(publicacion);

    this.router.navigate(['/marketplace']);
  }
}