import { Routes } from '@angular/router';

import { authGuard } from './identity/auth.guard';

import { BoardPageComponent } from '~board/features/board-page.component';
import { TicketDetailsPageComponent } from '~board/features/ticket-details-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'board',
  },
  {
    path: 'board',
    component: BoardPageComponent,
  },
  {
    path: 'ticket',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: TicketDetailsPageComponent,
        title: 'Create Ticket',
      },
      {
        path: ':ticketId',
        component: TicketDetailsPageComponent,
        title: 'Edit Ticket',
      },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    data: { requiresAdmin: true },
    loadChildren: () => import('./admin/admin.routes').then((routes) => routes),
  },
  { path: '**', redirectTo: 'board' },
];
