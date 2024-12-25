import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from './data/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const { authToken } = inject(AuthStore);
  const token = authToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
