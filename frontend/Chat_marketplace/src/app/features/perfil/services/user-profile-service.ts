import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  usuario = signal<UserProfile>({
    id: 5,
    nombre: 'Gibran',
    avatarUrl: './assets/profile/profile-example.png',
  });

  perfil = this.usuario.asReadonly();
}
