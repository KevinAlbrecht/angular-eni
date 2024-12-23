import {
  ContentChildren,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { REORDER_DROP_DATATYPE } from '../constants';
import { DraggableDirective } from './draggable.directive';

@Directive({
  selector: '[appDroppable]',
})
export class DroppableDirective {
  @Input({ required: true })
  columnId!: string;

  @Output()
  dropItem = new EventEmitter();

  @ContentChildren(DraggableDirective)
  draggables!: QueryList<DraggableDirective>;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const dt = event.dataTransfer;

    if (!dt?.types.includes(REORDER_DROP_DATATYPE)) {
      return;
    }

    const data = dt.getData(REORDER_DROP_DATATYPE);
    let destination = {
      id: '',
      columnId: this.columnId,
    };

    this.draggables.forEach((draggable) => {
      if (draggable.hasDragEntered) {
        destination = draggable.appDraggableData;
      }

      draggable.reset();
    });

    try {
      const parsedData = JSON.parse(data);
      this.dropItem.emit([
        {
          columnId: parsedData.columnId,
          ticketId: parsedData.id,
        },
        {
          columnId: destination.columnId,
          ticketId: destination.id,
        },
      ]);
    } catch (err: unknown) {
      return;
    }
  }

  constructor() {}
}
