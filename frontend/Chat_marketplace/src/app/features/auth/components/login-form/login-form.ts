import { Component, inject, signal} from '@angular/core';
import { AuthService } from '../../services/auth-service';

import { MainButton } from '../../../../shared/components/main-button/main-button/main-button';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [MainButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  authService = inject(AuthService)

  user = signal('');
  password = signal('');

  iniciarSesion(){

  }
  
}
