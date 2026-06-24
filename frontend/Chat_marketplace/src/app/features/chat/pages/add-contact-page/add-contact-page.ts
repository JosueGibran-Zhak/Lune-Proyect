import { Component, computed, inject, signal } from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { UserSearchResult } from '../../models/user-search-result';
import { AddContactControls } from '../../../../layout/add-contact-actions/add-contact-actions';
import { AddContactResults } from '../../../../layout/add-contact-results/add-contact-results';

@Component({
  selector: 'app-add-contact-page',
  standalone: true,
  imports: [AddContactControls, AddContactResults],
  template: `
    <div class="page add-contact-page">
      <app-add-contact-controls
        [busqueda]="busqueda()"
        (busquedaCambiada)="buscarUsuarios($event)"
      />

      <app-add-contact-results
        [usuarios]="usuariosEncontrados()"
        (agregar)="agregarContacto($event)"
      />
    </div>
  `,
  styleUrl: './add-contact-page.scss',
})
export class AddContactPage {
  private chatService = inject(ChatService);

  busqueda = signal('');

  usuariosEncontrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const usuarios = this.chatService.usuariosDisponibles();

    if (!texto) return [];

    return usuarios.filter(usuario =>
      usuario.usuario.toLowerCase().includes(texto) ||
      usuario.id.toLowerCase().includes(texto)
    );
  });

  buscarUsuarios(texto: string): void {
    this.busqueda.set(texto);
    this.chatService.buscarUsuarios(texto);
  }

  agregarContacto(usuario: UserSearchResult): void {
    this.chatService.agregarContacto(usuario);
  }
}