import { Routes } from '@angular/router';
import { DashboardPageComponent } from './components/dashboard-page.component';

export default [
  {
    path: '',
    component: DashboardPageComponent,
  },
  { path: '**', redirectTo: '' },
] as Routes;
