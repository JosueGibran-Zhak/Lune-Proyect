import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';
import { inject } from '@angular/core';

export const noAuthGuardGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router)

  authService.cargarSesionGuardada();

  if(authService.autenticado()){
    return router.createUrlTree(['/chat-contacts']);
  }

  return true;
};
