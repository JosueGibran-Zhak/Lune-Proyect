import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CambioModo {
  
  modo = signal<'chat' | 'marketplace'>('chat')

  mostrarSearchChat(){
    this.modo.set('chat');
  }
  mostrarSearchMarketplace(){
    this.modo.set('marketplace');
  }
}
