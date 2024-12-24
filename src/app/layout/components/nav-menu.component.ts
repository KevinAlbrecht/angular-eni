import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink],
  template: `
    <div>
      <a routerLink="">Board</a>
      <a [routerLink]="isAdmin() ? '/admin' : undefined" [class]="isAdmin() ? '' : 'disabled'">Admin</a>
    </div>
  `,
  styles: `
    div {
      display: flex;
      gap: 20px;
      a {
        text-decoration: none;
        color: inherit;
        &.active {
          border-bottom: 1px solid #555;
        }
        &.disabled {
          color: #999;
        }
      }
    }
  `,
})
export class NavMenuComponent {
  isAdmin = input<boolean>(false);
}
