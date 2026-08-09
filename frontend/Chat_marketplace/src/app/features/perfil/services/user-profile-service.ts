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

  // Signals para guardar el estado original (Copia del backend)
  private telefonoInicial = signal('');
  private instagramInicial = signal('');
  private facebookInicial = signal('');
  private tiktokInicial = signal('');

  // Signals actuales del formulario
  telefono = signal('');
  instagram = signal('');
  facebook = signal('');
  tiktok = signal('');

  // COMPUTEDS PARA ERRORES (Puros: no hacen .set() en otras signals)
  errorTelefono = computed(() => {
    const telefono = this.telefono().trim();
    if (telefono.length === 0) return '';

    // Define una expresión regular para validar números telefónicos.
    // ^        -> Inicio del texto.
    // [0-9 ]   -> Solo permite números del 0 al 9 y espacios en blanco.
    // {7,15}   -> Exige un mínimo de 7 y un máximo de 15 caracteres.
    // $        -> Fin del texto.
    if( telefono.length > 10){
      return 'El teléfono debe tener 10 dígitos o menos';
    }
    const regexTelefono = /^[0-9 ]{7,15}$/;
    return regexTelefono.test(telefono) ? '' : 'El teléfono solo debe tener números y espacios.';
  });

  errorInstagram = computed(() => {
    const instagram = this.instagram().trim();
    if (instagram.length === 0) return '';
    return instagram.startsWith('@') ? '' : 'Instagram debe iniciar con @.';
  });

  errorFacebook = computed(() => {
    const facebook = this.facebook().trim();
    return facebook.length <= 50 ? '' : 'Facebook no debe pasar de 50 caracteres.';
  });

  errorTiktok = computed(() => {
    const tiktok = this.tiktok().trim();
    if (tiktok.length === 0) return '';
    return tiktok.startsWith('@') ? '' : 'TikTok debe iniciar con @.';
  });

  mensajeExito = signal('');
  cargando = signal(false);

  usuarioActual = computed(() => this.authService.usuarioActual());
  perfilDisponible = computed(() => this.perfilSignal() !== null);

  //Computed para comprobar si por lo menos un campo del fórmulario se modificó
  formularioModificado = computed(() => {
    return (
      this.telefono().trim() != this.telefonoInicial().trim()   ||
      this.instagram().trim() != this.instagramInicial().trim() ||
      this.facebook().trim() != this.facebookInicial().trim()   ||
      this.tiktok().trim() != this.tiktokInicial().trim()
    );
  });

  formularioValido = computed(() => {
    return (
      this.errorTelefono() === '' &&
      this.errorInstagram() === '' &&
      this.errorFacebook() === '' &&
      this.errorTiktok() === ''
    );
  });

  //COMPUTED HABILITAR / DESHABILITAR guardar
  //Verifica que se haya modificado un campo en el form y que sea valido.
  puedoGuardar = computed(() => {
    return this.formularioModificado() && this.formularioValido();
  });

  cargarPerfil(): void {
    this.mensajeExito.set('');
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

          const tel = perfil.telefono ?? '';
          const insta = perfil.instagram ?? '';
          const fb = perfil.facebook ?? '';
          const tk = perfil.tiktok ?? '';

          //Guarda el valor inicial al cargar
          this.telefonoInicial.set(tel);
          this.instagramInicial.set(insta);
          this.facebookInicial.set(fb);
          this.tiktokInicial.set(tk);

          //Guarda el valor actual 
          this.telefono.set(tel);
          this.instagram.set(insta);
          this.facebook.set(fb);
          this.tiktok.set(tk);

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
    this.mensajeExito.set('');
    this.telefono.set(valor);
  }

  actualizarInstagram(valor: string): void {
    this.mensajeExito.set('');
    this.instagram.set(valor);
  }

  actualizarFacebook(valor: string): void {
    this.mensajeExito.set('');
    this.facebook.set(valor);
  }

  actualizarTiktok(valor: string): void {
    this.mensajeExito.set('');
    this.tiktok.set(valor);
  }

  guardarCambios(): void {
    const usuario = this.localStorageService.obtenerSesion()?.usuario;

    if (!usuario) {
      return;
    }

    if (!this.formularioValido()) {
      return;
    }

    //Verifica cambios y valida antes de guardar.
    if (!this.puedoGuardar()) {
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

          const tel = perfilActualizado.telefono ?? '';
          const insta = perfilActualizado.instagram ?? '';
          const fb = perfilActualizado.facebook ?? '';
          const tk = perfilActualizado.tiktok ?? '';

          //Guarda el valor inicial al cargar
          this.telefonoInicial.set(tel);
          this.instagramInicial.set(insta);
          this.facebookInicial.set(fb);
          this.tiktokInicial.set(tk);

          //Guarda el valor actual 
          this.telefono.set(tel);
          this.instagram.set(insta);
          this.facebook.set(fb);
          this.tiktok.set(tk);

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