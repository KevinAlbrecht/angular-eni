import { inject, Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';

import { BoardApiService } from './sources/board-api.service';
import { BoardDbService } from './sources/board-db.service';

import { Board, DragDropLocation, Ticket, TicketEditionCreation } from '~board/models';
import { ConnectivityService } from '~shared/data/connectivity.service';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private apiService = inject(BoardApiService);
  private dbService = inject(BoardDbService);
  private connectivityService = inject(ConnectivityService);

  hasChangesToSync = false;

  getBoard() {
    if (!this.connectivityService.onlineStatusValue) {
      return this.dbService.getBoard().pipe(
        map(
          ([columns, tickets]) =>
            ({
              columns,
              tickets,
            }) as Board
        )
      );
    }
    return this.apiService
      .getBoard()
      .pipe(tap({ next: (board) => this.dbService.saveBoard(board) }));
  }

  reorderTicket(from: DragDropLocation, to: DragDropLocation, locallyOrderedTickets: Ticket[]) {
    if (!this.connectivityService.onlineStatusValue && locallyOrderedTickets) {
      this.hasChangesToSync = true;
      return this.dbService.saveTickets(locallyOrderedTickets);
    }
    return this.apiService
      .reorderTicket(from, to)
      .pipe(tap({ next: (board) => this.dbService.saveBoard(board) }));
  }

  createTicket(modele: TicketEditionCreation, columnId: string) {
    if (!this.connectivityService.onlineStatusValue) {
      this.hasChangesToSync = true;
      return this.dbService.saveTicket(modele, columnId);
    }

    return this.apiService.createTicket(modele, columnId).pipe(
      tap({
        next: ({ ticket }) => this.dbService.saveTicket(ticket).subscribe(),
      })
    );
  }

  editTicket(model: TicketEditionCreation) {
    if (!this.connectivityService.onlineStatusValue) {
      this.hasChangesToSync = true;
      return this.dbService.saveTicket(model);
    }

    return this.apiService.editTicket(model).pipe(
      tap({
        next: ({ ticket }) => this.dbService.saveTicket(ticket).subscribe(),
      })
    );
  }

  getTicketById(id: string) {
    if (!this.connectivityService.onlineStatusValue) {
      return this.dbService.getTicketById(id);
    }

    return this.apiService.getTicketById(id);
  }

  syncChanges() {
    return this.dbService
      .getBoard()
      .pipe(
        switchMap(([columns, tickets]) => this.apiService.syncBoard({ columns, tickets } as Board))
      );
  }

  resetLocalData() {
    return this.dbService.reset();
  }
}
