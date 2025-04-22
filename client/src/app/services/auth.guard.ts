import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const token = userService.token;
  const isLoggedIn = userService.isLoggedIn;

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
