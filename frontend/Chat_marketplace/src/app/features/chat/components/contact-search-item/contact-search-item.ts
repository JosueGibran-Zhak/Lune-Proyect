import { Component, input, output } from '@angular/core';
import { UserSearchResult } from '../../models/user-search-result';

@Component({
  selector: 'app-contact-search-item',
  imports: [],
  template: `
    <div class="contact-search-item">
      <div class="avatar">
          <img
              src="assets/nav-buttons/usuario.png"
              [alt]="usuario().usuario"
              class="avatar-img"
          />
      </div>

      <span class="usuario">
          {{ usuario().usuario }}
          <span class="id">#{{ usuario().id }}</span>
      </span>

      <button
          class="add-btn"
          type="button"
          (click)="onAgregar()"
      >
          <img
              [src]="usuario().agregado
                ? 'assets/action-buttons/add-user.png'
                : 'assets/action-buttons/add.png'"
              alt="Agregar"
          >
      </button>
  </div>
  `,
  styleUrl: './contact-search-item.scss',
})
export class ContactSearchItem {
  usuario = input.required<UserSearchResult>();

  agregar = output<UserSearchResult>();

  onAgregar(): void {
    if (this.usuario().agregado) return;

    this.agregar.emit(this.usuario());
  }
}