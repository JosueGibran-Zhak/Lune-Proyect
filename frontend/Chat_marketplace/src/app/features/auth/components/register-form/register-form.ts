import { Component, inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { MainButton } from '../../../../shared/components/main-button/main-button/main-button';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule,MainButton],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  authService = inject(AuthService);

  correo = signal('');
  userName = signal('');
  password = signal('');
  confirmPassword = signal('');

  registrarse(): void{
    this.authService.register({
      correo: this.correo(),
      userName: this.userName(),
      password: this.password(),
      confirmPassword: this.confirmPassword()
    });
  }
}
