import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnComponent } from '../../app/board/ui/column.component';
import { CardComponent } from '../../app/board/ui/card.component';
import { DraggableDirective } from '../../app/board/ui/draggable.directive';
import { DroppableDirective } from '../../app/board/ui/droppable.directive';
import { ActivatedRouteSnapshot, Route, RouterLink, provideRouter } from '@angular/router';
import { setInputs } from '../helper';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Ticket } from '../../app/board/models';

const testingRoutes = [{ path: '', component: class {} }] as Route[];

@Component({
  selector: 'app-card',
  template: `<div id="mock-card">MockCardComponent</div>`,
})
class MockUserCardComponent {}

describe('ColumnComponent', () => {
  let component: ColumnComponent;
  let fixture: ComponentFixture<ColumnComponent>;
  let mockSnapshot: Partial<ActivatedRouteSnapshot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnComponent, RouterLink],
      providers: [provideRouter(testingRoutes)],
    })
      .overrideComponent(ColumnComponent, {
        remove: { imports: [CardComponent, DraggableDirective, DroppableDirective] },
        add: {
          imports: [MockUserCardComponent],
          schemas: [NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    mockSnapshot = { data: {} };
    fixture = TestBed.createComponent(ColumnComponent);
    component = fixture.componentInstance;
  });

  it('should render the column title', () => {
    const columnTitle = 'Test Column';
    const column = { id: 1, title: columnTitle };
    const tickets: Partial<Ticket>[] = [];

    setInputs(fixture, { column, tickets });

    const titleElement = fixture.nativeElement.querySelector('h4');
    expect(titleElement.textContent).toContain(columnTitle);
  });

  it('should render the tickets', () => {
    const column = { id: 1, title: 'Test Column' };
    const tickets: Partial<Ticket>[] = [
      { id: '1', title: 'Ticket 1' },
      { id: '2', title: 'Ticket 2' },
    ];

    setInputs(fixture, { column, tickets });

    const ticketElements = fixture.nativeElement.querySelectorAll('app-card');
    expect(ticketElements.length).toBe(tickets.length);
  });

  it('should render "No tickets" when there are no tickets', () => {
    const column = { id: 1, title: 'Test Column' };
    const tickets: Partial<Ticket>[] = [];

    setInputs(fixture, { column, tickets });
    setInputs(fixture, { tickets: [] });

    const ticketElements = fixture.nativeElement.querySelectorAll('app-card');
    expect(ticketElements.length).toBe(tickets.length);

    const noTicketsElement = fixture.nativeElement.querySelector('p');
    expect(noTicketsElement.textContent).toBe('No tickets');
  });
});
