import { Component, computed, effect, inject, signal } from '@angular/core';
import { ColumnComponent } from '../ui/column.component';
import { DragDropLocation, Ticket } from '../models';
import { BoardStore } from '../data/board.store';
import { AuthStore } from '../../identity/data/auth.store';

@Component({
  selector: 'app-board-page',
  imports: [ColumnComponent],
  template: `
    <div id="wrapper">
      @if (!isUserConnected()) {
        <span>Please log in</span>
      } @else {
        <div id="columns-wrapper">
          @if (isLoadingBoard()) {
            <p>Loading...</p>
          } @else {
            @for (column of columns(); track column.id) {
              <app-column
                data-testid="column"
                [column]="column"
                [tickets]="ticketByColumnId()[column.id]"
                (reorderTicket)="onReorderTicket($event)"
              />
            } @empty {
              @if (hasError()) {
                <p>An error occured</p>
              } @else {
                <p>No column</p>
              }
            }
          }
        </div>
      }
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
  private boardStore = inject(BoardStore);
  private authStore = inject(AuthStore);

  columns = this.boardStore.columns;
  ticketByColumnId = this.boardStore.ticketByColumnId;
  isLoadingBoard = this.boardStore.isLoadingData;
  hasError = computed(() => this.boardStore.error() !== null);
  isUserConnected = this.authStore.isUserConnected;

  constructor() {
    effect(() => {
      const isConnected = this.isUserConnected();
      if (isConnected) {
        this.boardStore.load();
      } else {
        this.boardStore.reset();
      }
    });
  }

  onReorderTicket([from, to]: [DragDropLocation, DragDropLocation]) {
    this.boardStore.reorderTicket({ from, to });
  }
}
