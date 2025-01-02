import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DraggableDirective } from '../../app/board/ui/draggable.directive';
import { Component } from '@angular/core';
import { REORDER_DROP_DATATYPE } from '../../app/board/constants';

@Component({
  imports: [DraggableDirective],
  template: ` <div appDraggable [appDraggableData]="data"></div> `,
})
class TestComponent {
  data = { id: '1', columnId: '2' };
}

describe('DraggableDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;
  let directiveElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(DraggableDirective)).nativeElement;
  });

  it('should add the "draggable" attribute to the element', () => {
    expect(directiveElement.getAttribute('draggable')).toBeTruthy();
  });

  it('should set/unset hasDragEntered depending on dragging events', () => {
    directiveElement.dispatchEvent(new DragEvent('dragenter'));
    fixture.detectChanges();
    expect(directiveElement).toHaveClass('drag-entered');

    directiveElement.dispatchEvent(new DragEvent('dragleave'));
    fixture.detectChanges();
    expect(directiveElement).not.toHaveClass('drag-entered');
  });

  it('should set the appDraggableData in dataTransfer when dragstart event is triggered', () => {
    const appDraggableData = { id: '1', columnId: '2' };
    const event = new DragEvent('dragstart', { dataTransfer: new DataTransfer() });

    fixture.detectChanges();
    directiveElement.dispatchEvent(event);

    const storedData = event.dataTransfer?.getData(REORDER_DROP_DATATYPE);
    expect(storedData).toBe(JSON.stringify(appDraggableData));
  });
});
