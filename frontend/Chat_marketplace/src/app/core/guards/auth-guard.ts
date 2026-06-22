import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.cargarSesionGuardada();

  if(authService.autenticado()){
    return true;
  }

  return router.createUrlTree(['/auth-page']);
};
