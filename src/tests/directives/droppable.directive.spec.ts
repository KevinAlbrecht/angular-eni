import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { REORDER_DROP_DATATYPE } from '~board/constants';
import { DraggableDirective } from '~board/ui/draggable.directive';
import { DroppableDirective } from '~board/ui/droppable.directive';

function initDropEvent(data?: unknown) {
  const dt = new DataTransfer();
  dt.setData(REORDER_DROP_DATATYPE, JSON.stringify(data));
  return new DragEvent('drop', { dataTransfer: dt });
}

@Component({
  imports: [DroppableDirective, DraggableDirective],
  template: `
    <div appDroppable [columnId]="COLUMN_ID" (dropItem)="onDrop($event)">
      @for (data of dataSet; track $index) {
        <div appDraggable [appDraggableData]="data"></div>
      }
    </div>
  `,
})
class TestComponent {
  readonly COLUMN_ID = '1';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onDrop(_: unknown) {}

  dataSet = [
    { id: '1', columnId: this.COLUMN_ID },
    { id: '2', columnId: this.COLUMN_ID },
    { id: '3', columnId: this.COLUMN_ID },
  ];
}

describe('DroppableDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let droppableElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DroppableDirective, DraggableDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    droppableElement = fixture.debugElement.query(By.directive(DroppableDirective)).nativeElement;
    fixture.detectChanges();
  });

  it('should trigger onDrop with correct payload when drop on empty column', () => {
    spyOn(component, 'onDrop');

    const data = { id: '1', columnId: '2' };
    const event = initDropEvent(data);
    droppableElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.onDrop).toHaveBeenCalledWith([
      { ticketId: data.id, columnId: data.columnId },
      { ticketId: '', columnId: component.COLUMN_ID },
    ]);
  });

  it('should not trigger onDrop no data transferred', () => {
    spyOn(component, 'onDrop');

    const event = initDropEvent();
    droppableElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.onDrop).not.toHaveBeenCalled();
  });

  it('should trigger onDrop with correct payload when drop hover a specific ticket', () => {
    spyOn(component, 'onDrop');
    const firstDraggable = fixture.debugElement.query(
      By.directive(DraggableDirective)
    ).nativeElement;
    const data = { id: '1', columnId: '2' };
    const event = initDropEvent(data);

    firstDraggable.dispatchEvent(new DragEvent('dragenter'));
    droppableElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.onDrop).toHaveBeenCalledWith([
      { ticketId: data.id, columnId: data.columnId },
      { ticketId: '1', columnId: component.COLUMN_ID },
    ]);
  });
});
