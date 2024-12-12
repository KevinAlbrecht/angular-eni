import { Component } from '@angular/core';
import { HeaderComponent } from './layout/components/header.component';
import { BoardPageComponent } from './board/components/board-page.component';

@Component({
  selector: 'app-root',
  imports: [BoardPageComponent, HeaderComponent],
  template: `<div>
    <app-header />
    <app-board-page />
  </div>`,
})
export class AppComponent {}
