import { Component, inject, signal } from '@angular/core';
import { UserCardComponent } from './user-card.component';
import { NavMenuComponent } from './nav-menu.component';
import { AuthService } from '../../identity/auth.service';
import { LoginFormValue } from '../../identity/models';
import { tap } from 'rxjs';
import { LoginFormComponent } from '../../identity/components/login-form.component';

@Component({
  selector: 'app-header',
  imports: [UserCardComponent, NavMenuComponent, LoginFormComponent],
  template: `
    <div id="wrapper">
      <app-nav-menu [isAdmin]="isUserAdmin()" />
      <app-user-card (toggleAuth)="onToggleAuth()" [username]="userName()" />
      @if(isLoginFormVisible()){
      <div class="modal-wrapper">
        <div class="modal-body">
          <app-login-form
            (submitForm)="onSubmitForm($event)"
            (close)="isLoginFormVisible.set(false)"
            [isLoading]="isLoggingin()"
            [error]="loginError()"
          />
        </div>
      </div>
      }
    </div>
  `,
  styles: `
    #wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 20px;
      gap: 15px;
      border-bottom: 2px solid #5555;
      height: 50px;
      justify-content: space-between;
    }
  `,
})
export class HeaderComponent {
  private authService = inject(AuthService);

  isUserAdmin = this.authService.isAdmin;
  userName = this.authService.username;
  isLoginFormVisible = signal(false);
  isLoggingin = signal(false);
  loginError = signal<string | null>(null);

  onToggleAuth() {
    if (this.authService.isUserConnected()) {
      this.authService.logout();
    } else {
      this.isLoginFormVisible.set(true);
      this.loginError.set(null);
    }
  }

  onSubmitForm({ email, password }: LoginFormValue) {
    this.isLoggingin.set(true);
    this.loginError.set(null);
    this.authService
      .login(email, password)
      .pipe(tap({ finalize: () => this.isLoggingin.set(false) }))
      .subscribe({
        next: () => this.isLoginFormVisible.set(false),
        error: (error) => this.loginError.set(error.message),
      });
  }
}
