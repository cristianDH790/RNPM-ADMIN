// auth-guard.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/service/auth.service';
import Swal from 'sweetalert2';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) { //Verificar si es autenticado
    if (authService.usuario.perfil.idPerfil ==1) {//Verificar si tiene perfil administrador
      return true;
    } else {
      Swal.fire('Inicio de sesión', `Hola ${authService.usuario.nombres} no tienes acceso a este recurso!`, 'info');
    }
  }
  router.navigate(['/authentication/login']);
  return false;
};
