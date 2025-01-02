import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardPageComponent } from '../../app/board/features/board-page.component';
import { AuthStoreType, BoardStoreType, getAuthStoreSpyObj, getBoardStoreSpyObj } from '../helper';
import { ColumnComponent } from '../../app/board/ui/column.component';
import { BoardStore } from '../../app/board/data/board.store';
import { AuthStore } from '../../app/identity/data/auth.store';
import { By } from '@angular/platform-browser';
import { getBoardWithOneColumn } from '../mocks/board';
import { provideRouter } from '@angular/router';

describe('BoardPageComponent', () => {
  let fixture: ComponentFixture<BoardPageComponent>;
  let mockBoardStore: jasmine.SpyObj<BoardStoreType>;
  let mockAuthStore: jasmine.SpyObj<AuthStoreType>;

  beforeEach(async () => {
    mockBoardStore = getBoardStoreSpyObj();
    mockAuthStore = getAuthStoreSpyObj();

    await TestBed.configureTestingModule({
      imports: [BoardPageComponent, ColumnComponent],
      providers: [
        { provide: BoardStore, useValue: mockBoardStore },
        { provide: AuthStore, useValue: mockAuthStore },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardPageComponent);
    fixture.detectChanges();
  });

  it('should display Please log in when user is not connected', () => {
    mockAuthStore.isUserConnected.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span')?.textContent).toBe('Please log in');
  });

  it('should display Loading... when board data is loading', () => {
    mockAuthStore.isUserConnected.set(true);
    mockBoardStore.isLoadingData.set(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')?.textContent).toBe('Loading...');
  });

  it('should display no columns message when there is no column', () => {
    mockAuthStore.isUserConnected.set(true);
    mockBoardStore.isLoadingData.set(false);
    mockBoardStore.columns.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p')?.textContent).toBe('No column');
  });

  it('should load/reset board data when user connect/disconnect', () => {
    expect(mockBoardStore.load).not.toHaveBeenCalled();

    mockAuthStore.isUserConnected.set(true);
    fixture.detectChanges();

    expect(mockBoardStore.load).toHaveBeenCalled();

    mockAuthStore.isUserConnected.set(false);
    fixture.detectChanges();

    expect(mockBoardStore.reset).toHaveBeenCalledTimes(2);
  });

  it("should call store's reorderTicket when onReorderTicket is called", () => {
    const from = { columnId: '1', ticketId: '1' };
    const to = { columnId: '2', ticketId: '2' };

    const { columns } = getBoardWithOneColumn();

    mockAuthStore.isUserConnected.set(true);
    mockBoardStore.isLoadingData.set(false);
    mockBoardStore.columns.set(columns);
    fixture.detectChanges();

    const columnComponent = fixture.debugElement.query(
      By.css('[data-testid="column"]')
    ).componentInstance;

    columnComponent.reorderTicket.emit([from, to]);
    fixture.detectChanges();

    expect(mockBoardStore.reorderTicket).toHaveBeenCalledWith({
      from,
      to,
    });
  });
});
