import { Directive, ElementRef, HostBinding, HostListener, input } from '@angular/core';

import { REORDER_DROP_DATATYPE } from '~board/constants';

@Directive({
  selector: '[appDraggable]',
})
export class DraggableDirective {
  private dragEnterCount = 0;
  @HostBinding('class.dragging') isDragging = false;
  @HostBinding('class.drag-entered') hasDragEntered = false;

  appDraggableData = input.required<{
    id: string;
    columnId: string;
  }>();

  @HostListener('dragenter', ['$event'])
  ondragEnter() {
    this.dragEnterCount++;
    this.hasDragEntered = true;
  }

  @HostListener('dragleave', ['$event'])
  ondragLeave() {
    this.dragEnterCount--;
    if (this.dragEnterCount === 0) {
      this.hasDragEntered = false;
    }
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.isDragging = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData(REORDER_DROP_DATATYPE, JSON.stringify(this.appDraggableData()));
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
