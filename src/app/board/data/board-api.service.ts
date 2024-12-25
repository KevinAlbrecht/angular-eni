import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  TicketResponse,
  DragDropLocation,
  GetBoardResponse,
  TicketEditionCreation,
} from '../models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardApiService {
  private http = inject(HttpClient);

  constructor() {}

  getBoard() {
    return this.http.get<GetBoardResponse>('/api/board').pipe(map((r) => r.board));
  }

  reorderTicket(from: DragDropLocation, to: DragDropLocation) {
    return this.http
      .patch<GetBoardResponse>(`/api/board/ticket/reorder/${from.ticketId}`, {
        to,
      })
      .pipe(map((r) => r.board));
  }

  createTicket(modele: TicketEditionCreation, columnId: string) {
    return this.http.post<TicketResponse>(`/api/board/ticket/${columnId}`, {
      ticket: modele,
    });
  }

  editTicket(modele: TicketEditionCreation) {
    return this.http.patch<TicketResponse>(`/api/board/ticket`, {
      ticket: modele,
    });
  }

  getTicketById(id: string) {
    return this.http.get<TicketResponse>(`/api/board/ticket/${id}`).pipe(map((r) => r.ticket));
  }
}
