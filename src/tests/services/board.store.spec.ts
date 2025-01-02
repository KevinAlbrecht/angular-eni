import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BoardApiService } from '../../app/board/data/board-api.service';
import { delay, of } from 'rxjs';
import { BoardStore } from '../../app/board/data/board.store';
import { Board, Ticket, TicketEditionCreation } from '../../app/board/models';
import { getBoardWithOneColumn } from '../mocks/board';
import * as helpers from '../../app/board/helpers';
import { Router } from '@angular/router';

describe('BoardStore', () => {
  let serviceSpy: jasmine.SpyObj<BoardApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let boardWithOneColumn: Board;
  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('BoardApiService', [
      'getBoard',
      'reorderTicket',
      'createTicket',
      'editTicket',
      'getTicketById',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    boardWithOneColumn = getBoardWithOneColumn();

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardApiService, useValue: serviceSpy },
        BoardStore,
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should load the board', fakeAsync(() => {
    serviceSpy.getBoard.and.returnValue(of(boardWithOneColumn).pipe(delay(300)));

    const { columns, ticketByColumnId, load, isLoadingData } = TestBed.inject(BoardStore);
    const expectedTicketsMap = helpers.getTicketstMap(
      boardWithOneColumn.columns,
      boardWithOneColumn.tickets
    );
    expect(columns()).toEqual([]);
    expect(ticketByColumnId()).toEqual({});
    expect(isLoadingData()).toBeFalse();

    load();
    tick(100);

    expect(isLoadingData()).toBeTrue();
    tick(200);

    expect(isLoadingData()).toBeFalse();
    expect(columns()).toEqual(boardWithOneColumn.columns);
    expect(ticketByColumnId()).toEqual(expectedTicketsMap);
  }));

  it('should create a ticket', fakeAsync(() => {
    const columnId = 'column1';
    const ticketToCreate: TicketEditionCreation = {
      id: columnId,
      columnId: '',
      title: 'Ticket 5',
      description: 'Description 5',
      type: 'bug',
    };
    const expectedTicket: Ticket = { ...ticketToCreate, columnId, id: 'ticket5', order: 5 };
    const { createTicket, isLoadingAction, ticketByColumnId, load } = TestBed.inject(BoardStore);

    serviceSpy.getBoard.and.returnValue(of(boardWithOneColumn));
    serviceSpy.createTicket.and.returnValue(of({ ticket: expectedTicket }).pipe(delay(200)));

    load();
    expect(isLoadingAction()).toBeFalse();
    createTicket({ ticket: ticketToCreate, columnId });
    tick(100);

    expect(isLoadingAction()).toBeTrue();
    tick(100);

    expect(isLoadingAction()).toBeFalse();
    expect(serviceSpy.createTicket).toHaveBeenCalledOnceWith(ticketToCreate, columnId);
    expect(routerSpy.navigate).toHaveBeenCalled();
    tick(200);

    expect(ticketByColumnId()[columnId].length).toBe(5);
    expect(ticketByColumnId()[columnId][4]).toEqual(expectedTicket);
  }));

  it('should reorderTicket tickets', fakeAsync(() => {
    const { tickets, columns } = boardWithOneColumn;
    const from = { ticketId: 'ticket1', columnId: 'column1' };
    const to = { ticketId: 'ticket2', columnId: 'column1' };
    const { reorderTicket, isLoadingAction, ticketByColumnId, load } = TestBed.inject(BoardStore);

    const expectedReorderedTickets = helpers.reorder(
      from,
      to,
      structuredClone(tickets),
      structuredClone(columns)
    );
    const expectedNewBoard = helpers.getTicketstMap(columns, expectedReorderedTickets);
    serviceSpy.getBoard.and.returnValue(of(boardWithOneColumn));
    serviceSpy.reorderTicket.and.returnValue(
      of({
        columns,
        tickets: expectedReorderedTickets,
      }).pipe(delay(300))
    );

    load();
    expect(isLoadingAction()).toBeFalse();
    reorderTicket({ from, to });
    expect(ticketByColumnId()).toEqual(expectedNewBoard);
    tick(100);

    expect(isLoadingAction()).toBeTrue();
    tick(200);

    expect(isLoadingAction()).toBeFalse();
    expect(ticketByColumnId()).toEqual(expectedNewBoard);
    expect(serviceSpy.reorderTicket).toHaveBeenCalledOnceWith(from, to);
  }));

  it('should reset all information', fakeAsync(() => {
    serviceSpy.getBoard.and.returnValue(of(boardWithOneColumn));
    const { error, isLoadingAction, isLoadingData, ticketByColumnId, columns, load, reset } =
      TestBed.inject(BoardStore);
    expect(ticketByColumnId()).toEqual({});

    load();
    tick(200);
    reset();
    tick(100);
    expect(isLoadingData()).toBeFalse();
    expect(isLoadingAction()).toBeFalse();
    expect(error()).toBeNull();
    expect(columns()).toEqual([]);
    expect(ticketByColumnId()).toEqual({});
  }));
});
