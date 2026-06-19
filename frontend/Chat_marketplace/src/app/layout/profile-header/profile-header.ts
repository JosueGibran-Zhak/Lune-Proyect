import { Component } from '@angular/core';
import { BackButton } from '../../shared/components/back-button/back-button';

@Component({
  selector: 'app-profile-header',
  imports: [BackButton],
  template: `
    <header class="header">
      <app-back-button ruta="/chat-contacts"/>
    </header>

    <div class="title-bar">
      Perfil de usuario
    </div>
  `,
  styleUrl: './profile-header.scss',
})
export class ProfileHeader {}
