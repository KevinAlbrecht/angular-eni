import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  imports: [],
  template: `
    <div>
      <span>{{ username() }}</span>
      <button (click)="toggleAuth.emit()" [class]="isConnected() ? 'connected' : ''">
        {{ isConnected() ? 'Log out' : 'Log in' }}
      </button>
    </div>
  `,
  styles: `
    div {
      display: flex;
      gap: 8px;
    }
    button {
      --green: #007b00;
      --red: #880000;

      background: none;
      border: none;
      border-bottom: 1px solid var(--green);
      color: var(--green);
      cursor: pointer;
      padding: 0;

      &.connected {
        border-color: var(--red);
        color: var(--red);
      }
    }
  `,
})
export class UserCardComponent {
  username = input<string>('');
  toggleAuth = output<void>();
  isConnected = computed(() => !!this.username());
}
