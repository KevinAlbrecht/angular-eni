import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from './card.component';
import { Column, Ticket } from '../models';

@Component({
  selector: 'app-column',
  imports: [CardComponent],
  template: `
    <div id="wrapper">
      <h4>{{ column.title }}</h4>
      <div id="list">
        <app-card [ticket]="tickets[0]" />
      </div>
      <button (click)="addTicket.emit()">Add Ticket</button>
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

      button {
        margin-top: 10px;
        border: none;
        outline: none;
        padding: 6px 0;
        cursor: pointer;
        background-color: white;
        border-radius: 5px;
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
  @Input({ required: true }) column!: Column;
  @Input({ required: true }) tickets!: Ticket[];
  @Output() addTicket = new EventEmitter<void>();
}
