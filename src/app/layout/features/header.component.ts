import { Component, inject, linkedSignal, signal } from '@angular/core';
import { UserCardComponent } from '../ui/user-card.component';
import { NavMenuComponent } from '../ui/nav-menu.component';
import { AuthStore } from '../../identity/data/auth.store';
import { LoginFormValue } from '../../identity/models';
import { tap } from 'rxjs';
import { LoginFormComponent } from '../../identity/ui/login-form.component';

@Component({
  selector: 'app-header',
  imports: [UserCardComponent, NavMenuComponent, LoginFormComponent],
  template: `
    <div id="wrapper">
      <app-nav-menu [isAdmin]="isUserAdmin()" />
      <app-user-card (toggleAuth)="onToggleAuth()" [username]="userName()" />
      @if (isLoginFormVisible()) {
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
  private authStore = inject(AuthStore);

  isUserConnected = this.authStore.isUserConnected;
  isUserAdmin = this.authStore.isUserAdmin;
  userName = this.authStore.username;
  isLoggingin = this.authStore.isLoggingin;
  loginError = this.authStore.error;
  isLoginFormVisible = linkedSignal({
    source: this.isUserConnected,
    computation: () => false,
  });

  onToggleAuth() {
    if (this.isUserConnected()) {
      this.authStore.logout();
    } else {
      this.isLoginFormVisible.set(true);
      this.authStore.resetError();
    }
  }

  onSubmitForm({ email, password }: LoginFormValue) {
    this.authStore.login({ email, password });
  }
}
