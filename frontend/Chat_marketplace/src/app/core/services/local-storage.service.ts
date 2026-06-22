import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { RespuestaAuth } from '../../features/auth/models/login.model';
import { ChatMessage } from '../../features/chat/models/chat-message';

@Injectable({
  providedIn: 'root',
})

//Servicio de persistencia de datos
export class LocalStorageService {
  private readonly claveSesion = 'chat_sesion';
  private readonly claveMensajes = 'chat_mensajes';

  private platformId = inject(PLATFORM_ID);

  private esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  
  guardarSesion(sesion: RespuestaAuth): void {
    if(!this.esNavegador()) return;
    localStorage.setItem(this.claveSesion, JSON.stringify(sesion));
  }
  obtenerSesion(): RespuestaAuth | null {
    if (!this.esNavegador()){
      return null;
    }
    const sesion = localStorage.getItem(this.claveSesion);

    if(!sesion){
      return null;
    }
    return JSON.parse(sesion) as RespuestaAuth;
  }

  cerrarSesion(): void {
    if (!this.esNavegador()) return;
    localStorage.removeItem(this.claveSesion);
  }

  guardarMensajes(mensajes: ChatMessage[]): void {
    if (!this.esNavegador()) return;
    localStorage.setItem(this.claveMensajes, JSON.stringify(mensajes));
  }
  obtenerMensajes(): ChatMessage[] {
    if (!this.esNavegador()) return [];
    const mensajes = localStorage.getItem(this.claveMensajes);

    if(!mensajes) {
      return [];
    }
    return JSON.parse(mensajes) as ChatMessage[];
  }


  limpiarTodo(): void {
    if (!this.esNavegador()) return;

    localStorage.removeItem(this.claveSesion);
    localStorage.removeItem(this.claveMensajes);
  }
}
