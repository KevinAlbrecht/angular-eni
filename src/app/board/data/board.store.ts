import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withComputed,
  withHooks,
  WritableStateSource,
} from '@ngrx/signals';
import {
  addEntity,
  setEntity,
  setEntities,
  removeAllEntities,
  setAllEntities,
  EntityState,
} from '@ngrx/signals/entities';
import { withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, switchMap, tap } from 'rxjs';

import { BoardService } from './board.service';

import { getTicketstMap, reorder } from '~board/helpers';
import { Board, Column, DragDropLocation, Ticket, TicketEditionCreation } from '~board/models';
import { ConnectivityService } from '~shared/data/connectivity.service';
import { withSelectedEntity } from '~shared/data/features';

type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

type State = {
  columns: Column[];
  isLoadingData: boolean;
  actionStatus: ActionStatus;
  error: string | null;
};

const initialState: State = {
  columns: [],
  isLoadingData: false,
  actionStatus: 'idle',
  error: null,
};

type BoardStoreType = WritableStateSource<State & EntityState<Ticket>>;
export const createBoardPatcher = (store: BoardStoreType) => (board: Board) => {
  patchState(store, { columns: board.columns });
  patchState(store, setAllEntities(board.tickets));
};

export const BoardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Ticket>(),
  withSelectedEntity<Ticket>(),
  withComputed(({ columns, actionStatus, entities }) => ({
    ticketByColumnId: computed(() => {
      const cols = columns();
      return getTicketstMap(cols, entities());
    }),
    isLoadingAction: computed(() => actionStatus() === 'loading'),
  })),
  withMethods((store) => {
    const boardService = inject(BoardService);
    const router = inject(Router);
    const _patchBoard = createBoardPatcher(store);

    const load = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoadingData: true })),
        switchMap(() =>
          boardService.getBoard().pipe(
            tapResponse({
              next: (board) => {
                _patchBoard(board);
                patchState(store, { error: null });
              },
              error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
              finalize: () => patchState(store, { isLoadingData: false }),
            })
          )
        )
      )
    );

    const createTicket = rxMethod<{
      ticket: TicketEditionCreation;
      columnId?: string;
    }>(
      pipe(
        tap(() => patchState(store, { actionStatus: 'loading' })),
        switchMap(({ ticket, columnId }) =>
          boardService.createTicket(ticket, columnId || '').pipe(
            tapResponse({
              next: ({ ticket }) => {
                patchState(store, {
                  error: null,
                  actionStatus: 'success',
                });

                patchState(store, addEntity(ticket));
                router.navigate(['/ticket', ticket.id]);
              },
              error: (error: HttpErrorResponse) =>
                patchState(store, {
                  error: error.message,
                  actionStatus: 'error',
                }),
            })
          )
        )
      )
    );

    const editTicket = rxMethod<TicketEditionCreation>(
      pipe(
        tap(() => patchState(store, { actionStatus: 'loading' })),
        switchMap((ticket) =>
          boardService.editTicket(ticket).pipe(
            tapResponse({
              next: ({ ticket }) => {
                patchState(store, {
                  error: null,
                  actionStatus: 'success',
                });
                patchState(store, setEntity(ticket));
              },
              error: (error: HttpErrorResponse) =>
                patchState(store, {
                  error: error.message,
                  actionStatus: 'error',
                }),
            })
          )
        )
      )
    );

    const reorderTicket = rxMethod<{
      from: DragDropLocation;
      to: DragDropLocation;
    }>(
      pipe(
        tap(() => patchState(store, { actionStatus: 'loading' })),
        map(({ from, to }) => {
          const locallyOrderedTickets = reorder(from, to, store.entities(), store.columns());
          return { from, to, locallyOrderedTickets };
        }),
        tap(({ locallyOrderedTickets }) => {
          patchState(store, setEntities(locallyOrderedTickets));
        }),
        switchMap(({ from, to, locallyOrderedTickets }) =>
          boardService.reorderTicket(from, to, locallyOrderedTickets).pipe(
            tapResponse({
              next: (board) => {
                _patchBoard(board);
                patchState(store, {
                  error: null,
                  actionStatus: 'success',
                });
              },
              error: (error: HttpErrorResponse) =>
                patchState(store, {
                  error: error.message,
                  actionStatus: 'error',
                }),
            })
          )
        )
      )
    );

    const reset = () => {
      patchState(store, initialState);
      patchState(store, removeAllEntities());
      boardService.resetLocalData().subscribe();
    };

    const resetActionStatus = () => patchState(store, { actionStatus: 'idle' });

    return {
      load,
      createTicket,
      editTicket,
      reorderTicket,
      reset,
      resetActionStatus,
    };
  }),
  withHooks((store) => {
    const boardService = inject(BoardService);
    const connectivityService = inject(ConnectivityService);
    const _patchBoard = createBoardPatcher(store);

    return {
      onInit: () => {
        connectivityService.onlineStatus$
          .pipe(
            filter((isOnline) => isOnline === true && boardService.hasChangesToSync),
            tap(() => patchState(store, { isLoadingData: true })),
            switchMap(() =>
              boardService.syncChanges().pipe(
                tapResponse({
                  next: ({ board }) => {
                    _patchBoard(board);
                  },
                  error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                  finalize: () => patchState(store, { isLoadingData: false }),
                })
              )
            )
          )
          .subscribe();
      },
    };
  })
);
