import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { BoardStoreType, getBoardStoreSpyObj } from '../helper';
import { getSimpleTicket } from '../mocks/board';

import { BoardStore } from '~board/data/board.store';
import { TicketDetailsPageComponent } from '~board/features/ticket-details-page.component';
import { TicketEditionCreation } from '~board/models';

const testingRoutes = [
  {
    path: 'ticket',
    children: [
      { path: '', component: TicketDetailsPageComponent },
      {
        path: ':ticketId',
        component: TicketDetailsPageComponent,
      },
    ],
  },
];

describe('TicketDetailsPageComponent', async () => {
  let component: TicketDetailsPageComponent;
  let mockBoardStore: jasmine.SpyObj<BoardStoreType>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    mockBoardStore = getBoardStoreSpyObj(getSimpleTicket());

    await TestBed.configureTestingModule({
      imports: [TicketDetailsPageComponent],
      providers: [
        { provide: BoardStore, useValue: mockBoardStore },
        provideRouter(testingRoutes, withComponentInputBinding()),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  describe('With ticketId in route', () => {
    beforeEach(async () => {
      component = await harness.navigateByUrl('ticket/123', TicketDetailsPageComponent);
      harness.detectChanges();
    });

    it('should initialize form with ticketId', () => {
      const { description, title, type, assignee } = getSimpleTicket();
      const expectedResult = {
        description,
        title,
        type,
        assignee: assignee || null,
      };

      expect(component.ticketId()).toBe('123');
      expect(mockBoardStore.setSelectedEntityId).toHaveBeenCalledWith('123');
      expect(component.form.getRawValue()).toEqual(expectedResult);
    });

    it('should enable/disable form depending on loading state', () => {
      mockBoardStore.actionStatus.set('loading');
      harness.detectChanges();
      expect(component.form.disabled).toBe(true);

      mockBoardStore.actionStatus.set('idle');
      harness.detectChanges();
      expect(component.form.disabled).toBe(false);
    });

    it('should call editTicket when form is submitted', () => {
      const { description, title, type, assignee } = getSimpleTicket();
      const editTicket = { description, title, type, assignee };
      component.form.setValue(editTicket);
      component.onSubmit();

      expect(mockBoardStore.editTicket).toHaveBeenCalledWith({
        ...editTicket,
        id: '123',
      } as TicketEditionCreation);
    });

    it('should reset form when cancel is clicked', () => {
      const { description, title, type, assignee } = getSimpleTicket();
      const expectedResult = { description, title, type, assignee };
      const tempValue = {
        description: 'other value',
        title: 'other value',
        type: 'feat',
        assignee: 'other value',
      };

      component.form.setValue(tempValue);
      expect(component.form.getRawValue()).toEqual(tempValue);
      component.onCancel();
      expect(component.form.getRawValue()).toEqual(expectedResult);
    });

    it('should display form fiels on edition mode', () => {
      const qs = (selector: string) => harness.fixture.nativeElement.querySelector(selector);

      expect(component.isFormMode()).toBe(false);

      let titleInput = qs('input[formControlName="title"]');
      let descriptionInput = qs('textarea[formControlName="description"]');
      let typeInput = qs('select[formControlName="type"]');
      let assigneeInput = qs('input[formControlName="assignee"]');

      expect(titleInput).toBeFalsy();
      expect(descriptionInput).toBeFalsy();
      expect(typeInput).toBeFalsy();
      expect(assigneeInput).toBeFalsy();

      component.isFormRequested.set(true);
      expect(component.isFormMode()).toBe(true);
      harness.detectChanges();

      titleInput = qs('input[formControlName="title"]');
      descriptionInput = qs('textarea[formControlName="description"]');
      typeInput = qs('select[formControlName="type"]');
      assigneeInput = qs('input[formControlName="assignee"]');

      expect(titleInput).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
      expect(typeInput).toBeTruthy();
      expect(assigneeInput).toBeTruthy();
    });
  });

  describe('Without ticketId in route', () => {
    beforeEach(async () => {
      component = await harness.navigateByUrl('ticket', TicketDetailsPageComponent);
      harness.detectChanges();
    });

    it('should initialize form with no ticketId', () => {
      const expectedResult = {
        description: '',
        title: '',
        type: 'bug',
        assignee: '',
      };

      expect(component.ticketId()).toBe(undefined);
      expect(mockBoardStore.setSelectedEntityId).toHaveBeenCalledWith(null);
      expect(component.form.getRawValue()).toEqual(expectedResult);
    });

    it('should call editTicket when form is submitted', async () => {
      component = await harness.navigateByUrl(
        'ticket?columnId=column1',
        TicketDetailsPageComponent
      );
      harness.detectChanges();

      const { description, title, type, assignee, columnId } = getSimpleTicket();
      const editTicket = { description, title, type, assignee };
      component.form.setValue(editTicket);
      component.onSubmit();

      expect(mockBoardStore.createTicket).toHaveBeenCalledWith({
        ticket: {
          ...editTicket,
          id: undefined,
        } as TicketEditionCreation,
        columnId,
      });
    });

    it('should should not leave edition mode', () => {
      expect(component.isFormMode()).toBe(true);

      component.isFormRequested.set(false);
      harness.detectChanges();

      expect(component.isFormMode()).toBe(true);
    });
  });
});
