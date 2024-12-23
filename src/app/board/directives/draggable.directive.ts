import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { REORDER_DROP_DATATYPE } from '../constants';

@Directive({
  selector: '[appDraggable]',
})
export class DraggableDirective {
  private dragEnterCount = 0;
  @HostBinding('class.dragging') isDragging = false;
  @HostBinding('class.drag-entered') hasDragEntered = false;

  @Input({ required: true })
  appDraggableData!: {
    id: string;
    columnId: string;
  };

  @HostListener('dragenter', ['$event'])
  ondragEnter(event: DragEvent) {
    this.dragEnterCount++;
    this.hasDragEntered = true;
  }

  @HostListener('dragleave', ['$event'])
  ondragLeave(event: DragEvent) {
    this.dragEnterCount--;
    if (this.dragEnterCount === 0) {
      this.hasDragEntered = false;
    }
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.isDragging = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData(REORDER_DROP_DATATYPE, JSON.stringify(this.appDraggableData));
    }
  }

  constructor(el: ElementRef) {
    el.nativeElement.draggable = true;
  }

  reset() {
    this.dragEnterCount = 0;
    this.hasDragEntered = false;
    this.isDragging = false;
  }
}
