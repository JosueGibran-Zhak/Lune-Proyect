import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeticionLogin,PeticionRegistro,RespuestaAuth } from '../models/login.model';
import { Usuario } from '../models/usuario.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private servicioHttp = inject(HttpClient);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);

  private readonly apiUrl = '/api/auth';

  modo = signal<'login' | 'registro'>('login');
  sesion = signal<RespuestaAuth | null >(
    this.localStorageService.obtenerSesion()
  );

  usuarioActual = computed<Usuario | null>(() =>{
    return this.sesion()?.usuario ?? null;
  });
  autenticado = computed<boolean>(() => {
    return !!this.sesion()?.token;
  });
  

  esLogin = computed(() => this.modo() === 'login');
  esRegistro = computed(() => this.modo() === 'registro');

  mostrarLogin(){
    this.modo.set('login');
  }
  mostrarRegistro(){
    this.modo.set('registro');
  }

  cargarSesionGuardada(): void {
    const sesionGuardada = this.localStorageService.obtenerSesion();

    if (sesionGuardada) {
      this.sesion.set(sesionGuardada);
    }
  }

  login(credenciales: PeticionLogin): void {

    this.servicioHttp.post<RespuestaAuth>(`${this.apiUrl}/login`, credenciales)
      .subscribe({
        next: (respuesta) => {
          this.sesion.set(respuesta);
          this.localStorageService.guardarSesion(respuesta);
          this.router.navigateByUrl('/chat-contacts');
        },
        error: () => {
          alert('Usuario o contraseña incorrectos.');
        } 
      });
  }

  register(datos: PeticionRegistro): void {
    this.servicioHttp.post<RespuestaAuth>(`${this.apiUrl}/register`, datos)
    .subscribe({
      next: (respuesta) =>{
          this.sesion.set(respuesta);
          this.localStorageService.guardarSesion(respuesta);
          this.router.navigateByUrl('/chat-contacts');
      },
      error: () =>{
        alert('No se pudo registrar al usuario');
      }
    })
  }

  cerrarSesion(): void {

    this.sesion.set(null);
    this.localStorageService.cerrarSesion();
    this.router.navigateByUrl('/auth-page');
  }

  obtenerToken(): string | null {
    return this.sesion()?.token ?? null;
  }
}
