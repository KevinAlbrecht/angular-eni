import { Component, inject } from '@angular/core';
import { UserCardComponent } from './user-card.component';
import { NavMenuComponent } from './nav-menu.component';
import { AuthService } from '../../identity/auth.service';

@Component({
  selector: 'app-header',
  imports: [UserCardComponent, NavMenuComponent],
  template: `
    <div id="wrapper">
      <app-nav-menu [isAdmin]="isUserAdmin()" />
      <app-user-card (toggleAuth)="onToggleAuth()" [username]="userName()" />
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

  onToggleAuth() {
    if (this.authService.isUserConnected()) {
      this.authService.logout();
    } else {
      this.authService.login('user@test.com', '1234').subscribe();
    }
  }
}
