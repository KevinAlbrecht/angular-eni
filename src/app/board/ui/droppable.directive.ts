import { ContentChildren, Directive, HostListener, QueryList, input, output } from '@angular/core';

import { DraggableDirective } from './draggable.directive';

import { REORDER_DROP_DATATYPE } from '~board/constants';
import { DragDropPayload } from '~board/models';
import { environment } from '~env/environment';

@Directive({
  selector: '[appDroppable]',
})
export class DroppableDirective {
  columnId = input.required<string>();
  dropItem = output<DragDropPayload>();

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
      columnId: this.columnId(),
    };

    this.draggables.forEach((draggable) => {
      if (draggable.hasDragEntered) {
        destination = draggable.appDraggableData();
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
      if (!environment.production) {
        console.error('Error parsing drop data', err);
      }
      return;
    }
  }
}
