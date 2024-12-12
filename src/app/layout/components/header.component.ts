import { Component } from '@angular/core';
import { UserCardComponent } from './user-card.component';
import { NavMenuComponent } from './nav-menu.component';

@Component({
  selector: 'app-header',
  imports: [UserCardComponent, NavMenuComponent],
  template: `
    <div id="wrapper">
      <app-nav-menu [isAdmin]="isUserAdmin" />
      <app-user-card (toggleAuth)="onToggleAuth()" />
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
  isUserAdmin = false;
  onToggleAuth() {}
}
