import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const { isUserConnected, isAdmin } = inject(AuthService);
  const doesRequireAdmin = route.data['requiresAdmin'] ?? false;

  if (!isUserConnected()) {
    return new RedirectCommand(router.parseUrl(''));
  }

  if (doesRequireAdmin && !isAdmin()) {
    return new RedirectCommand(router.parseUrl(''));
  }
  return true;
};
