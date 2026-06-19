import { Component, inject } from '@angular/core';
import { UserProfileService } from '../../features/perfil/services/user-profile-service';

@Component({
  selector: 'app-profile-content',
  imports: [],
  template: ` 
  <section class="profile-content">
    <img
      class="avatar"
      [src]="perfil().avatarUrl"
      alt="Foto de perfil"
    >

    <div class="info-card">
      <p>
        <span>Nombre de usuario:</span>
        {{ perfil().nombre }}
      </p>

      <p>
        <span>ID:</span>
        {{ perfil().id }}
      </p>
    </div>
  </section>


  `,
  styleUrl: './profile-content.scss',
})
export class ProfileContent {
  private userProfileService = inject(UserProfileService);

  perfil = this.userProfileService.perfil;
}
