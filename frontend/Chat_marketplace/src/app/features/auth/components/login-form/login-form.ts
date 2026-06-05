import { Router } from '@angular/router';

import { Component, inject, signal} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { MainButton } from '../../../../shared/components/main-button/main-button/main-button';

//BORRAR DESPUES ROUTES, Por ahora solo es para probar las interfaces

//-------------------------------------------------------------------


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [MainButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private router = inject(Router);

  authService = inject(AuthService);

  user = signal('');
  password = signal('');

  iniciarSesion(): void{
    //BORRAR DESPUES Y CAMBIARLO 
    this.router.navigate(['/chat-contacts']);
  }
}
