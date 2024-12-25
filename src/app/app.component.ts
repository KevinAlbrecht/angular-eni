import { Component } from '@angular/core';
import { HeaderComponent } from './layout/features/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  template: `<div>
    <app-header />
    <router-outlet />
  </div>`,
})
export class AppComponent {}
