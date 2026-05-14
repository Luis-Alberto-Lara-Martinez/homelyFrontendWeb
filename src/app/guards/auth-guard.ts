import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Users } from '../services/users/users';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(Users);
  const router = inject(Router);

  // Verificamos en el servicio si el token existe
  if (usersService.isAuthenticated()) {
    return true; // Si está logueado, permite pasar a la página
  } else {
    // Si NO está logueado, lo mandamos expulsado al /login
    router.navigate(['/login']);
    return false;
  }
};
