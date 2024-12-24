import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateTicketResponse, DragDropLocation, GetBoardResponse } from '../models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
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

  createTicket(columnId: string) {
    return this.http.post<CreateTicketResponse>(`/api/board/ticket/${columnId}`, {
      ticket: {
        description: '',
        title: 'New task',
        type: 'task',
      },
    });
  }
}
