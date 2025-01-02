import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

import { Board, Ticket, TicketEditionCreation, TicketResponse } from '~board/models';

@Injectable({ providedIn: 'root' })
export class BoardDbService {
  private idb = inject(NgxIndexedDBService);

  saveBoard(board: Board) {
    return forkJoin([this.idb.clear('columns'), this.idb.clear('tickets')])
      .pipe(
        switchMap(() =>
          forkJoin([
            this.idb.bulkAdd('columns', board.columns),
            this.idb.bulkAdd('tickets', board.tickets),
          ])
        )
      )
      .subscribe({
        error: () => console.error('Failing to save offline data'),
      });
  }

  saveTickets(tickets: Ticket[]) {
    return this.idb.clear('tickets').pipe(
      switchMap(() => this.idb.bulkAdd('tickets', tickets)),
      switchMap(() =>
        this.getBoard().pipe(map(([columns, tickets]) => ({ columns, tickets }) as Board))
      )
    );
  }

  saveTicket(
    ticket: TicketEditionCreation,
    columnId: string = ticket.columnId
  ): Observable<TicketResponse> {
    let action;
    if (this.isValidTicket(ticket)) {
      action = this.getTicketById(ticket.id).pipe(
        switchMap((currentTicket) => {
          if (currentTicket === undefined) {
            return this.createTicket(ticket, columnId);
          }
          return this.updateTicket(ticket);
        })
      );
    } else {
      ticket.columnId = columnId;
      action = this.createTicket(ticket, columnId);
    }

    return action.pipe(map((t) => ({ ticket: t as Ticket })));
  }

  getBoard() {
    return forkJoin([this.idb.getAll('columns'), this.idb.getAll('tickets')]);
  }

  getTicketById(id: string) {
    return this.idb.getByKey<Ticket>('tickets', id);
  }

  reset() {
    return forkJoin([this.idb.clear('columns'), this.idb.clear('tickets')]);
  }

  private updateTicket(ticket: TicketEditionCreation & { id: string }) {
    return this.getTicketById(ticket.id).pipe(
      switchMap((t) => this.idb.update('tickets', { ...t, ...ticket }))
    );
  }

  private createTicket(ticket: TicketEditionCreation, columnId: string) {
    return this.getLastOrder(columnId).pipe(
      switchMap((order) => {
        return this.idb.add('tickets', {
          ...ticket,
          id: this.generateId(),
          order,
        });
      })
    );
  }

  private getTicketsByColulmnId(columnId: string) {
    return this.idb.getAllByIndex('tickets', 'columnId', IDBKeyRange.only(columnId));
  }

  private getLastOrder(columnId: string) {
    return this.getTicketsByColulmnId(columnId).pipe(
      map((tickets) => {
        return tickets.length ? tickets.length + 1 : 0;
      })
    );
  }

  private generateId() {
    return `local-${Math.random().toString(36).substring(7)}`;
  }

  private isValidTicket(
    ticket: TicketEditionCreation
  ): ticket is TicketEditionCreation & { id: string } {
    return !!ticket.id;
  }
}
