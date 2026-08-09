import { Component, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { MainButton } from '../../../../shared/components/main-button/main-button/main-button';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule,MainButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  authService = inject(AuthService);

  userName = signal('');
  password = signal('');
  error = this.authService.error;

  iniciarSesion(): void{
    this.authService.login({
      userName: this.userName(),
      password: this.password()
    });
  }
}
