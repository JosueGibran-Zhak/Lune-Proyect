import { Component, inject} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LoginForm } from '../../components/login-form/login-form';
import { RegisterForm } from '../../components/register-form/register-form';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [LoginForm, RegisterForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  authService = inject(AuthService);
}
