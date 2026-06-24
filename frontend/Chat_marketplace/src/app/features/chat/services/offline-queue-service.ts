import { Injectable, inject, signal } from '@angular/core';
import { ChatMessage } from '../models/chat-message';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class OfflineQueueService {
  private localStorageService = inject(LocalStorageService);

  pendientes = signal<ChatMessage[]>(
    this.localStorageService.obtenerPendientes()
  );

  agregarPendiente(mensaje: ChatMessage): void {
    const nuevaLista = [...this.pendientes(), mensaje];

    this.pendientes.set(nuevaLista);
    this.localStorageService.guardarPendientes(nuevaLista);
  }

  obtenerPendientes(): ChatMessage[] {
    return this.pendientes();
  }

  limpiarPendientes(): void {
    this.pendientes.set([]);
    this.localStorageService.limpiarPendientes();
  }
}