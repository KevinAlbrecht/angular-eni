import { Component, input, output } from '@angular/core';
import { CardComponent } from './card.component';
import { Column, DragDropPayload, Ticket } from '../models';
import { DraggableDirective } from '../directives/draggable.directive';
import { DroppableDirective } from '../directives/droppable.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-column',
  imports: [CardComponent, DraggableDirective, DroppableDirective, RouterLink],
    template: `
    <div id="wrapper">
      <h4>{{ column().title }}</h4>
      <div id="list" appDroppable [columnId]="column().id" (dropItem)="reorderTicket.emit($event)">
        @for (ticket of tickets(); track ticket.id) {
          <app-card
            [ticket]="ticket"
            appDraggable
            [appDraggableData]="{
              id: ticket.id,
              columnId: column().id,
            }"
          />
        } @empty {
          <p>No tickets</p>
        }
      </div>
      <a routerLink="../ticket/" [queryParams]="{ columnId: column().id }"> Add Ticket </a>
    </div>
  `,
  styles: `
    #wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #7e7e7e26;
      padding: 10px;
      border-radius: 5px;
      min-width: 222px;

      h4 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 16px;
        color: black;
      }

      #list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      a{
        margin-top: 10px;
        border: none;
        outline: none;
        padding: 6px 0;
        cursor: pointer;
        background-color: white;
        border-radius: 5px;
        text-align: center;
        text-decoration: none;
        color: inherit;
      }

      [appDraggable] {
        &.drag-entered {
          box-shadow: 0 0 10px 2px #9ff2ff;
        }

        &.dragging {
          opacity: 0.4;
        }
      }
    }
  `,
})
export class ColumnComponent {
  column = input.required<Column>();
  tickets = input.required<Ticket[]>();
  addTicket = output<void>();
  reorderTicket = output<DragDropPayload>();
}
