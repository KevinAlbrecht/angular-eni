import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import {
  TicketResponse,
  DragDropLocation,
  GetBoardResponse,
  TicketEditionCreation,
  Board,
} from '../../models';

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

  editTicket(model: TicketEditionCreation) {
    return this.http.patch<TicketResponse>(`${environment.apiBaseUrl}api/board/ticket`, {
      ticket: model,
    });
  }

  getTicketById(id: string) {
    return this.http
      .get<TicketResponse>(`${environment.apiBaseUrl}api/board/ticket/${id}`)
      .pipe(map((r) => r.ticket));
  }

  syncBoard(offlineBoard: Board) {
    return this.http.post<GetBoardResponse>(`${environment.apiBaseUrl}api/board/sync`, {
      board: offlineBoard,
    });
  }
}
