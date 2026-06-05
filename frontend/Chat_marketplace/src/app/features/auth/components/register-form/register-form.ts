import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth-service';
import { MainButton } from '../../../../shared/components/main-button/main-button/main-button';

@Component({
  selector: 'app-register-form',
  imports: [MainButton],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  authService = inject(AuthService);
}
