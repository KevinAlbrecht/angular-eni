import { Component, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TICKET_TYPES, TicketEditionCreation, TicketType } from '../models';
import { FormErrorsMessagePipe } from '../../shared/ui/form-errors-message.pipe';
import { BoardStore } from '../data/board.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-details-page',
  imports: [ReactiveFormsModule, FormErrorsMessagePipe, RouterLink],
  template: `
    <div id="wrapper">
      <div class="head">
        <h2>
          {{ ticketId() ? 'Edition' : 'Creation' }}
        </h2>
        <a routerLink="/board">Go back</a>
      </div>
      @if (isLoading()) {
        <p>Loading...</p>
      } @else {
        @let ticket = currentTicket();
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <section>
            <h4>Title</h4>
            @if (isFormMode()) {
              <input formControlName="title" />
              <span class="error"
                >{{ getControlErrors('title') | formErrorsMessage: ERROR_MESSAGES }}
              </span>
            } @else {
              <span>{{ ticket?.title }}</span>
            }
          </section>
          <section>
            <h4>Description</h4>
            @if (isFormMode()) {
              <textarea formControlName="description"></textarea>
              <span class="error"
                >{{ getControlErrors('description') | formErrorsMessage: ERROR_MESSAGES }}
              </span>
            } @else {
              <span>{{ ticket?.description }}</span>
            }
          </section>
          <section>
            <h4>Type</h4>
            @if (isFormMode()) {
              <select formControlName="type">
                @for (option of ticketTypes; track option) {
                  <option [value]="option">
                    {{ option }}
                  </option>
                }
              </select>
              <span class="error"
                >{{ getControlErrors('type') | formErrorsMessage: ERROR_MESSAGES }}
              </span>
            } @else {
              <span>{{ ticket?.type }}</span>
            }
          </section>
          <section>
            <h4>Assigned to</h4>
            @if (isFormMode()) {
              <input formControlName="assignee" />
              <span class="error"
                >{{ getControlErrors('assignee') | formErrorsMessage: ERROR_MESSAGES }}
              </span>
            } @else {
              <span>{{ ticket?.assignee }}</span>
            }
          </section>
          <div class="actions">
            @if (isFormMode()) {
              <button type="submit" [disabled]="isActionLoading() || form.invalid">Submit</button>
              <button type="button" (click)="onCancel()">Cancel</button>
            } @else {
              <button type="button" (click)="onEdit()">Edit</button>
            }
          </div>
        </form>
        <p>{{ error() }}</p>
      }
    </div>
  `,
  styles: `
    #wrapper {
      margin: auto;
      width: 500px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
    }
    form {
      border: 1px solid #5555;
      border-radius: 10px;
      margin-top: 20px;
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: auto;
      padding: 10px;

      textarea {
        height: auto;
        width: 100%;
      }
    }
    h4 {
      margin-bottom: 5px;
      border-bottom: 1px solid;
    }
    section {
      min-height: 80px;
      width: 100%;
    }
  `,
})
export class TicketDetailsPageComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private boardStore = inject(BoardStore);

  ticketId = input<string>();
  columnId = input<string>();
  form: FormGroup;
  currentTicket = this.boardStore.selectedEntity;
  isLoading = this.boardStore.isLoadingData;
  isActionLoading = this.boardStore.isLoadingAction;
  error = this.boardStore.error;
  ticketTypes = TICKET_TYPES;
  isFormRequested = signal(false);
  isFormMode = computed(() => {
    const doesUserRequestForm = this.isFormRequested();
    const ticket = this.currentTicket();

    return doesUserRequestForm || !ticket;
  });

  ERROR_MESSAGES = {
    required: 'This field is required',
    minlength: 'This field must contain at least 5 characters',
    maxlength: 'This field must contain at most 50 characters',
  };

  constructor() {
    this.boardStore.resetActionStatus();

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      description: ['', [Validators.maxLength(200)]],
      type: [TICKET_TYPES[0] as TicketType, [Validators.required]],
      assignee: ['', [Validators.maxLength(50)]],
    });

    effect(() => {
      const status = this.boardStore.actionStatus();
      const id = this.ticketId();

      if (status === 'loading') {
        this.form.disable();
      } else {
        this.form.enable();
      }

      if (status === 'success' && id) {
        this.isFormRequested.set(false);
      }
    });

    effect(() => {
      const ticket = this.currentTicket();
      if (ticket) {
        this.form.reset(ticket);
      }
    });

    effect(() => {
      const ticketId = this.ticketId();
      this.boardStore.setSelectedEntityId(ticketId || null);
    });
  }
  ngOnDestroy(): void {
    this.boardStore.setSelectedEntityId(null);
  }

  getControlErrors(controlName: string) {
    const control = this.form.get(controlName);
    return (control?.touched && control.errors) || null;
  }

  onSubmit() {
    if (this.form.invalid || this.isActionLoading()) {
      return;
    }
    const value = { ...this.form.value, id: this.ticketId() };

    this.ticketId()
      ? this.boardStore.editTicket(value)
      : this.boardStore.createTicket({ ticket: value, columnId: this.columnId() });
  }

  onCancel() {
    const ticket = this.currentTicket();
    if (ticket) {
      this.form.reset(ticket);
      this.isFormRequested.set(false);
    } else {
      this.form.reset({
        type: TICKET_TYPES[0],
      });
    }
  }

  onEdit() {
    this.isFormRequested.set(true);
  }
}
