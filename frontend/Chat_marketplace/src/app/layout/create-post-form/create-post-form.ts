import { Component, computed, inject, signal } from '@angular/core';
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

  imagen = signal<File | null>(null);
  archivo = signal<File | null>(null);

  intentoGuardar = signal(false);
  guardando = signal(false);

  nombreValido = computed(() => this.nombre().trim().length > 0);
  descripcionValida = computed(() => this.descripcion().trim().length > 0);
  precioValido = computed(() => this.precio() > 0);
  unidadesValidas = computed(() => this.unidades() >= 0);
  horaValida = computed(() => this.horaDisponible().trim().length > 0);
  puntoValido = computed(() => this.puntoEntrega().trim().length > 0);
  imagenValida = computed(() => this.imagen() !== null);

  formularioValido = computed(() =>
    this.nombreValido() &&
    this.descripcionValida() &&
    this.precioValido() &&
    this.unidadesValidas() &&
    this.horaValida() &&
    this.puntoValido() &&
    this.imagenValida()
  );

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
    this.intentoGuardar.set(true);

    if (!this.formularioValido()) {
      return;
    }

    const imagenSeleccionada = this.imagen();

    if (!imagenSeleccionada) {
      return;
    }

    const publicacion: PostModelRequest = {
      nombre: this.nombre().trim(),
      descripcion: this.descripcion().trim(),
      precio: this.precio(),
      unidades: this.unidades(),
      horaDisponible: this.horaDisponible().trim(),
      puntoEntrega: this.puntoEntrega().trim(),
      imagen: imagenSeleccionada,
      archivo: this.archivo(),
    };

    this.guardando.set(true);

    this.postService.crearPublicacion(publicacion, () => {
      this.guardando.set(false);
      this.router.navigate(['/marketplace']);
    });
  }
}