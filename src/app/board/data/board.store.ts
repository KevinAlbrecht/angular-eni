import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { addEntity, setEntity, setEntities, removeAllEntities } from '@ngrx/signals/entities';
import { withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { BoardApiService } from './board-api.service';

import { getTicketstMap, reorder } from '~board/helpers';
import { Board, Column, DragDropLocation, Ticket, TicketEditionCreation } from '~board/models';
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
    const api = inject(BoardApiService);
    const router = inject(Router);

    const _patchBoard = (board: Board) => {
      patchState(store, { columns: board.columns });
      patchState(store, setEntities(board.tickets));
    };

    const load = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoadingData: true })),
        switchMap(() =>
          api.getBoard().pipe(
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
          api.createTicket(ticket, columnId || '').pipe(
            tapResponse({
              next: ({ ticket }) => {
                patchState(store, {
                  error: null,
                  actionStatus: 'success',
                });

                console.log('\n\n=====', ticket);
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
          api.editTicket(ticket).pipe(
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
        tap(({ from, to }) => {
          const locallyOrderedTickets = reorder(from, to, store.entities(), store.columns());
          patchState(store, setEntities(locallyOrderedTickets));
        }),
        switchMap(({ from, to }) =>
          api.reorderTicket(from, to).pipe(
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
  })
);
