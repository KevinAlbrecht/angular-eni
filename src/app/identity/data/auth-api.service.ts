import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '~env/environment';
import { AuthResponse } from '~identity/models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}api/login`, {
      email,
      password,
    });
  }

  logout() {
    return this.http.post(`${environment.apiBaseUrl}api/logout`, {});
  }
}
