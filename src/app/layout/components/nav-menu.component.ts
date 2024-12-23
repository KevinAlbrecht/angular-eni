import { Component, input } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  imports: [],
  template: `
    <div>
      <a>Board</a>
      <a [class]="isAdmin() ? '' : 'disabled'">Admin</a>
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
