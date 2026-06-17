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
        (busquedaCambiada)="busqueda.set($event)"
        (crearGrupo)="crearGrupo()"
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

    if (!texto) return [];

    return this.chatService.usuariosDisponibles().filter(usuario =>
      usuario.usuario.toLowerCase().includes(texto) ||
      usuario.id.toString().includes(texto)
    );
  });

  agregarContacto(usuario: UserSearchResult): void {
    this.chatService.agregarContacto(usuario);
  }

  crearGrupo(): void {
    console.log('Crear grupo pendiente');
  }
}