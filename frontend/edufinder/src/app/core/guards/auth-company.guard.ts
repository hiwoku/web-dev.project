import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const companyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  
  if (auth.isLoggedIn() && auth.role() === 'company') {
    return true;
  }

  
  router.navigate(['/']);
  return false;
};