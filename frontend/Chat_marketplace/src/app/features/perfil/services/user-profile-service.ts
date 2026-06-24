import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../auth/services/auth-service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { UserProfile, UserProfileRequest } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);

  private readonly apiUrl = '/api/perfil';

  private perfilSignal = signal<UserProfile | null>(null);
  perfil = this.perfilSignal.asReadonly();

  telefono = signal('');
  instagram = signal('');
  facebook = signal('');
  tiktok = signal('');

  errorTelefono = signal('');
  errorInstagram = signal('');
  errorFacebook = signal('');
  errorTiktok = signal('');
  mensajeExito = signal('');
  cargando = signal(false);

  usuarioActual = computed(() => this.authService.usuarioActual());
  perfilDisponible = computed(() => this.perfilSignal() !== null);

  cargarPerfil(): void {
  const usuario = this.localStorageService.obtenerSesion()?.usuario;

  console.log('Usuario desde localStorage:', usuario);

  if (!usuario) {
    return;
  }

  console.log('URL perfil:', `${this.apiUrl}/${usuario.id}`);

  this.cargando.set(true);

  this.http.get<UserProfile>(`${this.apiUrl}/${usuario.id}`)
    .subscribe({
      next: (perfil) => {
        console.log('Perfil recibido:', perfil);

        this.perfilSignal.set(perfil);

        this.telefono.set(perfil.telefono ?? '');
        this.instagram.set(perfil.instagram ?? '');
        this.facebook.set(perfil.facebook ?? '');
        this.tiktok.set(perfil.tiktok ?? '');

        this.cargando.set(false);
      },
      error: (error) => {
        console.log('Error cargando perfil:', error);
        console.log('URL usada:', `${this.apiUrl}/${usuario.id}`);
        this.cargando.set(false);
      }
    });
}

  actualizarTelefono(valor: string): void {
    this.telefono.set(valor);
    this.validarTelefono();
  }

  actualizarInstagram(valor: string): void {
    this.instagram.set(valor);
    this.validarInstagram();
  }

  actualizarFacebook(valor: string): void {
    this.facebook.set(valor);
    this.validarFacebook();
  }

  actualizarTiktok(valor: string): void {
    this.tiktok.set(valor);
    this.validarTiktok();
  }

  private validarTelefono(): boolean {
    const telefono = this.telefono().trim();

    if (telefono.length === 0) {
      this.errorTelefono.set('');
      return true;
    }

    const regexTelefono = /^[0-9 ]{7,15}$/;

    if (!regexTelefono.test(telefono)) {
      this.errorTelefono.set('El teléfono solo debe tener números y espacios.');
      return false;
    }

    this.errorTelefono.set('');
    return true;
  }

  private validarInstagram(): boolean {
    const instagram = this.instagram().trim();

    if (instagram.length === 0) {
      this.errorInstagram.set('');
      return true;
    }

    if (!instagram.startsWith('@')) {
      this.errorInstagram.set('Instagram debe iniciar con @.');
      return false;
    }

    this.errorInstagram.set('');
    return true;
  }

  private validarFacebook(): boolean {
    const facebook = this.facebook().trim();

    if (facebook.length > 50) {
      this.errorFacebook.set('Facebook no debe pasar de 50 caracteres.');
      return false;
    }

    this.errorFacebook.set('');
    return true;
  }

  private validarTiktok(): boolean {
    const tiktok = this.tiktok().trim();

    if (tiktok.length === 0) {
      this.errorTiktok.set('');
      return true;
    }

    if (!tiktok.startsWith('@')) {
      this.errorTiktok.set('TikTok debe iniciar con @.');
      return false;
    }

    this.errorTiktok.set('');
    return true;
  }

  private formularioValido(): boolean {
    const telefonoValido = this.validarTelefono();
    const instagramValido = this.validarInstagram();
    const facebookValido = this.validarFacebook();
    const tiktokValido = this.validarTiktok();

    return telefonoValido && instagramValido && facebookValido && tiktokValido;
  }

  guardarCambios(): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) {
      return;
    }

    if (!this.formularioValido()) {
      return;
    }

    const datos: UserProfileRequest = {
      telefono: this.telefono().trim(),
      instagram: this.instagram().trim(),
      facebook: this.facebook().trim(),
      tiktok: this.tiktok().trim(),
    };

    this.cargando.set(true);
    this.mensajeExito.set('');

    this.http.put<UserProfile>(`${this.apiUrl}/${usuario.id}`, datos)
      .subscribe({
        next: (perfilActualizado) => {
          this.perfilSignal.set(perfilActualizado);

          this.telefono.set(perfilActualizado.telefono);
          this.instagram.set(perfilActualizado.instagram);
          this.facebook.set(perfilActualizado.facebook);
          this.tiktok.set(perfilActualizado.tiktok);

          this.actualizarSesionLocal(perfilActualizado);

          this.mensajeExito.set('Perfil actualizado correctamente.');
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
        }
      });
  }

  private actualizarSesionLocal(perfil: UserProfile): void {
    const sesion = this.localStorageService.obtenerSesion();

    if (!sesion) {
      return;
    }

    const sesionActualizada = {
      ...sesion,
      usuario: {
        ...sesion.usuario,
        userName: perfil.nombre,
      }
    };

    this.localStorageService.guardarSesion(sesionActualizada);
    this.authService.sesion.set(sesionActualizada);
  }
}