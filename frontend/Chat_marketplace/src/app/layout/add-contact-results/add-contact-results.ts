import { Component, input, output } from '@angular/core';
import { ContactSearchItem } from '../../features/chat/components/contact-search-item/contact-search-item';
import { UserSearchResult } from '../../features/chat/models/user-search-result';

@Component({
  selector: 'app-add-contact-results',
  standalone: true,
  imports: [ContactSearchItem],
  template: `
    @if (usuarios().length > 0) {
      <section class="results-box">
        <p class="results-title">Usuarios encontrados:</p>

        <div class="results-list">
          @for (usuario of usuarios(); track usuario.id) {
            <app-contact-search-item
              [usuario]="usuario"
              (agregar)="agregar.emit($event)"
            />
          }
        </div>
      </section>
    }
  `,
  styleUrl: './add-contact-results.scss',
})
export class AddContactResults {
  usuarios = input<UserSearchResult[]>([]);

  agregar = output<UserSearchResult>();
}