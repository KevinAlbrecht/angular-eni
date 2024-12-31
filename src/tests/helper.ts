/* eslint-disable @typescript-eslint/no-explicit-any */
import { WritableSignal, signal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { Column, DragDropLocation, Ticket, TicketEditionCreation } from '~board/models';
import { User, LoginFormValue } from '~identity/models';

export function fillForm(
  form: FormGroup<any>,
  inputs: Record<string, string>,
  fixture: ComponentFixture<any>
) {
  form.patchValue(inputs);
  Object.keys(inputs).forEach((key) => {
    form.get(key)?.markAsTouched();
  });
  fixture.detectChanges();
}

export type AuthStoreType = {
  user: WritableSignal<User | null>;
  isUserConnected: WritableSignal<boolean>;
  isUserAdmin: WritableSignal<boolean>;
  username: WritableSignal<string | null>;
  authToken: WritableSignal<string | null>;
  isLoggingin: WritableSignal<boolean>;
  error: WritableSignal<string | null>;
  login: (value: LoginFormValue) => void;
  logout: () => void;
  resetError: () => void;
};

export function getAuthStoreSpyObj(): jasmine.SpyObj<AuthStoreType> {
  return {
    ...jasmine.createSpyObj('AuthStore', ['login', 'logout', 'resetError']),
    ...{
      user: signal(null),
      isUserConnected: signal(false),
      isUserAdmin: signal(false),
      username: signal(null),
      authToken: signal(null),
      isLoggingin: signal(false),
      error: signal(null),
    },
  };
}

export type BoardStoreType = {
  ticketByColumnId: WritableSignal<Record<string, Ticket[]>>;
  isLoadingAction: WritableSignal<boolean>;
  columns: WritableSignal<Column[]>;
  isLoadingData: WritableSignal<boolean>;
  actionStatus: WritableSignal<string>;
  error: WritableSignal<string | null>;
  selectedEntity: WritableSignal<Ticket | null>;
  entities: WritableSignal<Ticket[]>;
  load: () => void;
  createTicket: (p: { ticket: TicketEditionCreation; columnId: string }) => void;
  editTicket: (ticket: TicketEditionCreation) => void;
  reorderTicket: (params: { from: DragDropLocation; to: DragDropLocation }) => void;
  reset: () => void;
  resetActionStatus: () => void;
  setSelectedEntityId: (id: string | null) => void;
};

export function getBoardStoreSpyObj(
  defaultSelectedEntity?: Ticket
): jasmine.SpyObj<BoardStoreType> {
  const mockStore = {
    ...jasmine.createSpyObj('BoardStore', [
      'load',
      'createTicket',
      'editTicket',
      'reorderTicket',
      'reset',
      'resetActionStatus',
      'setSelectedEntityId',
    ]),
    ...{
      ticketByColumnId: signal({}),
      isLoadingAction: signal(false),
      columns: signal<Column[]>([]),
      isLoadingData: signal(false),
      actionStatus: signal<string>('idle'),
      error: signal<string | null>(null),
      selectedEntity: signal<Ticket | null>(null),
      entities: signal<Ticket[]>([]),
      setSelectedEntityId: jasmine
        .createSpy('setSelectedEntityId')
        .and.callFake((id: string | null) => {
          mockStore.selectedEntity.set(id ? defaultSelectedEntity : null);
        }),
    },
  };

  return mockStore;
}

export function setInputs(fixture: ComponentFixture<unknown>, inputs: Record<string, unknown>) {
  Object.entries(inputs).forEach(([inputName, value]) => {
    fixture.componentRef.setInput(inputName, value);
  });
  fixture.detectChanges();
}
