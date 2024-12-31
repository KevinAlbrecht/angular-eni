import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '~layout/features/header.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  template: `<div>
    <app-header />
    <router-outlet />
  </div>`,
})
export class AppComponent {}
