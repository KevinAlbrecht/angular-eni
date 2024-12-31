import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

import { AuthStore } from './data/auth.store';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const { isUserConnected, isUserAdmin } = inject(AuthStore);
  const doesRequireAdmin = route.data['requiresAdmin'] ?? false;

  if (!isUserConnected()) {
    return new RedirectCommand(router.parseUrl(''));
  }

  if (doesRequireAdmin && !isUserAdmin()) {
    return new RedirectCommand(router.parseUrl(''));
  }
  return true;
};
