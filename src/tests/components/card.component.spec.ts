import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';

import { setInputs } from '../helper';

import { CardComponent } from '~board/ui/card.component';
import { TitleLimiterPipe } from '~board/ui/title-limiter.pipe';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent, TitleLimiterPipe],
      providers: [RouterLink, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
  });

  it('should render the ticket title', () => {
    const ticket = {
      id: '1',
      title: 'Test Ticket',
      assignee: 'John Doe',
      type: 'feature',
    };
    setInputs(fixture, { ticket });

    const titleElement = fixture.nativeElement.querySelector('h4');
    const assigneeElement = fixture.nativeElement.querySelector('span');

    expect(titleElement.textContent).toContain('Test Ticket');
    expect(assigneeElement.textContent).toContain('John Doe');
  });

  it('should render "unassigned" when ticket assignee is not provided', () => {
    const ticket = {
      id: '1',
      title: 'Test Ticket',
      type: 'feature',
    };
    setInputs(fixture, { ticket });

    const assigneeElement = fixture.nativeElement.querySelector('span');
    expect(assigneeElement.textContent).toContain('unassigned');
  });

  it('should navigate to the ticket details page when clicked', () => {
    const ticket = {
      id: '1',
      title: 'Test Ticket',
      assignee: 'John Doe',
      type: 'feature',
    };
    setInputs(fixture, { ticket });

    const anchorElement = fixture.nativeElement.querySelector('a');
    expect(anchorElement.getAttribute('href')).toBe('/ticket/1');
  });
});
