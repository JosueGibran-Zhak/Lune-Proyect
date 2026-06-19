import { Component } from '@angular/core';
import { ProfileHeader } from '../../../../layout/profile-header/profile-header';
import { ProfileContent } from '../../../../layout/profile-content/profile-content';

@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeader,ProfileContent],
  template: `
    <main class="profile-page">
      <app-profile-header></app-profile-header>
      <app-profile-content></app-profile-content>
    </main>

  `,
  styleUrl: './profile-page.scss',
})
export class ProfilePage {}
