import {
  signalStore,
  withState,
  withHooks,
  withMethods,
  patchState,
  withComputed,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { computed, inject } from '@angular/core';
import { map, of, pipe, switchMap, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { User } from '../models';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

const AUTH_TOKEN_KEY = 'auth_token';

type AuthState = {
  user: User | null;
  authToken: string | null;
  isLoggingin: boolean;
  error: string | null;
};

type LoginCredentials = {
  email: string;
  password: string;
};

const initialState: AuthState = {
  user: null,
  authToken: null,
  isLoggingin: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isUserConnected: computed(() => !!user()),
    isUserAdmin: computed(() => {
      const u = user();
      return (u && u.isAdmin) ?? false;
    }),
    username: computed(() => user()?.username ?? null),
  })),
  withMethods((store) => {
    const api = inject(AuthApiService);
    const router = inject(Router);

    const login = rxMethod<LoginCredentials>(
      pipe(
        tap(() => patchState(store, { isLoggingin: true })),
        switchMap(({ email, password }) =>
          api.login(email, password).pipe(
            tapResponse({
              next: ({ user, authToken }) => {
                localStorage.setItem(AUTH_TOKEN_KEY, authToken);
                patchState(store, { user: user, authToken });
              },
              error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
              finalize: () => {
                patchState(store, { isLoggingin: false });
              },
            })
          )
        )
      )
    );
    const logout = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoggingin: true })),
        switchMap(() =>
          api.logout().pipe(
            tapResponse({
              next: () => {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                patchState(store, { user: null, authToken: null });
                router.navigate(['/']);
              },
              error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
              finalize: () => {
                patchState(store, { isLoggingin: false });
              },
            })
          )
        )
      )
    );
    function resetError() {
      patchState(store, { error: null });
    }

    return { login, logout, resetError };
  }),
  withHooks((store) => ({
    onInit() {
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (authToken) {
        patchState(store, { authToken });
      }
    },
  }))
);
