import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Route, RouterLink, provideRouter } from '@angular/router';

import { setInputs } from '../helper';

import { Ticket } from '~board/models';
import { CardComponent } from '~board/ui/card.component';
import { ColumnComponent } from '~board/ui/column.component';
import { DraggableDirective } from '~board/ui/draggable.directive';
import { DroppableDirective } from '~board/ui/droppable.directive';

const testingRoutes = [{ path: '', component: class {} }] as Route[];

@Component({
  selector: 'app-card',
  template: `<div id="mock-card">MockCardComponent</div>`,
})
class MockUserCardComponent {}

describe('ColumnComponent', () => {
  let fixture: ComponentFixture<ColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnComponent, RouterLink],
      providers: [provideRouter(testingRoutes)],
    })
      .overrideComponent(ColumnComponent, {
        remove: {
          imports: [CardComponent, DraggableDirective, DroppableDirective],
        },
        add: {
          imports: [MockUserCardComponent],
          schemas: [NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ColumnComponent);
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
