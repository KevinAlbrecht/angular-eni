import { Component, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthStore } from '~identity/data/auth.store';
import { LoginFormValue } from '~identity/models';
import { LoginFormComponent } from '~identity/ui/login-form.component';
import { NavMenuComponent } from '~layout/ui/nav-menu.component';
import { UserCardComponent } from '~layout/ui/user-card.component';
import { ConnectivityService } from '~shared/data/connectivity.service';

@Component({
  selector: 'app-header',
  imports: [UserCardComponent, NavMenuComponent, LoginFormComponent],
  template: `
    <div id="wrapper">
      <app-nav-menu [isAdmin]="isUserAdmin()" />
      @if (!isOnline()) {
        <span>OFFLINE MODE</span>
      }
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
  private connectivityService = inject(ConnectivityService);

  isOnline = toSignal(this.connectivityService.onlineStatus$);
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
