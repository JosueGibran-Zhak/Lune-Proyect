import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  modo = signal<'login' | 'registro'>('login')

  mostrarLogin(){
    this.modo.set('login');
  }

  mostrarRegistro(){
    this.modo.set('registro');
  }
}
