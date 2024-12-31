import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { getBoardWithMultipleColumns, getCreationTicket, getEditionTicket } from '../mocks/board';

import { BoardApiService } from '~board/data/board-api.service';
import { GetBoardResponse, DragDropLocation, TicketEditionCreation } from '~board/models';

describe('BoardApiService', () => {
  let service: BoardApiService;
  let httpMock: HttpTestingController;

  let getBoardResponse: GetBoardResponse;
  let creationTicket: TicketEditionCreation;
  let editionTicket: TicketEditionCreation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), BoardApiService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BoardApiService);

    getBoardResponse = {
      board: getBoardWithMultipleColumns(),
    } as GetBoardResponse;
    creationTicket = getCreationTicket();
    editionTicket = getEditionTicket();
  });

  it('should retrieve the board', () => {
    service.getBoard().subscribe((response) => {
      expect(response).toEqual(getBoardResponse.board);
    });

    const req = httpMock.expectOne('/api/board');
    expect(req.request.method).toBe('GET');
    req.flush(getBoardResponse);
  });

  it('should reorder a ticket', () => {
    const from: DragDropLocation = {
      columnId: 'columnId',
      ticketId: 'ticketId',
    };
    const to: DragDropLocation = {
      columnId: 'columnId2',
      ticketId: 'ticketId2',
    };

    service.reorderTicket(from, to).subscribe((value) => {
      expect(value).toEqual(getBoardResponse.board);
    });

    const req = httpMock.expectOne(`/api/board/ticket/reorder/${from.ticketId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ to });
    req.flush(getBoardResponse);
  });

  it('should create a ticket', () => {
    const columnId = 'columnId';

    service.createTicket(creationTicket, columnId).subscribe();

    const req = httpMock.expectOne(`/api/board/ticket/${columnId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ticket: creationTicket });
    req.flush({});
  });

  it('should edit a ticket', () => {
    service.editTicket(editionTicket).subscribe();

    const req = httpMock.expectOne('/api/board/ticket');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ ticket: editionTicket });
    req.flush({});
  });

  it('should retrieve a ticket by ID', () => {
    const tickerResponse = { ticket: editionTicket };
    service.getTicketById(editionTicket.id as string).subscribe();

    const req = httpMock.expectOne(`/api/board/ticket/${editionTicket.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(tickerResponse);
  });
});
