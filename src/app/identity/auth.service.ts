import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthResponse, User } from './models';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private _user = signal<User | null>(null);

  user = this._user.asReadonly();
  isUserConnected = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.isAdmin ?? false);
  username = computed(() => this.user()?.username ?? '');

  get authToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  constructor() {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>('/api/login', {
        email,
        password,
      })
      .pipe(
        tap({
          next: (authResponse) => {
            this._user.set(authResponse.user);
            localStorage.setItem(AUTH_TOKEN_KEY, authResponse.authToken);
          },
        }),
      );
  }

  logout() {
    return this.http.post('/api/logout', {}).subscribe({
      next: () => {
        this._user.set(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        this.router.navigate(['']);
      },
    });
  }
}
