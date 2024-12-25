import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthResponse, User } from '../models';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);

  constructor() {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('/api/login', {
      email,
      password,
    });
  }

  logout() {
    return this.http.post('/api/logout', {});
  }
}
