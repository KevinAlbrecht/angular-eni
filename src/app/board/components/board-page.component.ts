import { Component } from '@angular/core';
import { ColumnComponent } from './column.component';
import { allBoard } from '../data';
import { Column, DragDropLocation, Ticket } from '../models';

@Component({
  selector: 'app-board-page',
  imports: [ColumnComponent],
  template: `
    <div id="wrapper">
      <div id="columns-wrapper">
        @for (column of columns; track column.id) {
          <app-column
            [column]="column"
            [tickets]="ticketByColumnId[column.id]"
            (addTicket)="addTicket(column.id)"
            (reorderTicket)="onReorderTicket($event)"
          />
        } @empty {
          <p>No column</p>
        }
      </div>
    </div>
  `,
  styles: `
    #wrapper {
      padding: 20px;
    }
    #columns-wrapper {
      display: flex;
      gap: 10px;
    }
  `,
})
export class BoardPageComponent {
  ticketByColumnId: Record<string, Ticket[]> = {};
  columns = allBoard.columns;

  constructor() {
    this.ticketByColumnId = this.getTickestMap(allBoard.columns, allBoard.tickets);
  }

  addTicket(columnId: string) {
    console.log(`add new ticket to column ${columnId} !`);
  }

  onReorderTicket([from, to]: [DragDropLocation, DragDropLocation]) {
    function shift(arr: Ticket[], isUp: boolean, fromId: number = 0, toId: number = arr.length) {
      for (let ticket of arr) {
        if (ticket.order >= fromId && ticket.order <= toId) {
          ticket.order += isUp ? 1 : -1;
        }
      }
    }

    const fromTicket = this.ticketByColumnId[from.columnId].find((t) => t.id === from.ticketId);
    const toTicket = this.ticketByColumnId[to.columnId].find((t) => t.id === to.ticketId);
    const newOrder = toTicket?.order || 1;
    if (!fromTicket) return;
    if (from.columnId !== to.columnId) {
      shift(this.ticketByColumnId[from.columnId], false, fromTicket.order);
      shift(this.ticketByColumnId[to.columnId], true, newOrder);
    } else {
      const isGoingUp = fromTicket.order > newOrder;
      shift(
        this.ticketByColumnId[to.columnId],
        isGoingUp,
        Math.min(fromTicket.order, newOrder),
        Math.max(fromTicket.order, newOrder),
      );
    }

    fromTicket.order = newOrder;
    fromTicket.columnId = to.columnId;

    this.ticketByColumnId = this.getTickestMap(allBoard.columns, allBoard.tickets);
  }

  private getTickestMap(columns: Column[], tickets: Ticket[]) {
    const draftMap: Record<string, Ticket[]> = {};

    for (let ticket of tickets) {
      if (!draftMap[ticket.columnId]) {
        draftMap[ticket.columnId] = [];
      }
      const columnId = ticket.columnId;
      draftMap[columnId].push(ticket);
    }

    for (let { id } of columns) {
      const currentColumn = draftMap[id];
      if (!currentColumn) {
        draftMap[id] = [];
      } else currentColumn.sort((a, b) => a.order - b.order);
    }

    return draftMap;
  }
}
