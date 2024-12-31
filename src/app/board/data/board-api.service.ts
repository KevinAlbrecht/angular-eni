import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import {
  TicketResponse,
  DragDropLocation,
  GetBoardResponse,
  TicketEditionCreation,
} from '../models';

import { environment } from '~env/environment';
@Injectable({
  providedIn: 'root',
})
export class BoardApiService {
  private http = inject(HttpClient);

  getBoard() {
    return this.http
      .get<GetBoardResponse>(`${environment.apiBaseUrl}api/board`)
      .pipe(map((r) => r.board));
  }

  reorderTicket(from: DragDropLocation, to: DragDropLocation) {
    return this.http
      .patch<GetBoardResponse>(
        `${environment.apiBaseUrl}api/board/ticket/reorder/${from.ticketId}`,
        {
          to,
        }
      )
      .pipe(map((r) => r.board));
  }

  createTicket(modele: TicketEditionCreation, columnId: string) {
    return this.http.post<TicketResponse>(`${environment.apiBaseUrl}api/board/ticket/${columnId}`, {
      ticket: modele,
    });
  }

  editTicket(modele: TicketEditionCreation) {
    return this.http.patch<TicketResponse>(`${environment.apiBaseUrl}api/board/ticket`, {
      ticket: modele,
    });
  }

  getTicketById(id: string) {
    return this.http
      .get<TicketResponse>(`${environment.apiBaseUrl}api/board/ticket/${id}`)
      .pipe(map((r) => r.ticket));
  }
}
