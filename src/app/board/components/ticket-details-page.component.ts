import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TICKET_TYPES, Ticket, TicketType } from '../models';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { FormErrorsMessagePipe } from '../../shared/pipes/form-errors-message.pipe';

@Component({
  selector: 'app-ticket-details-page',
  imports: [ReactiveFormsModule, FormErrorsMessagePipe],
  template: `
    <div id="wrapper">
      @if(currentTicket.isLoading()){
      <p>Loading...</p>
      }@else { @let ticket = currentTicket.value();
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <section>
          <h4>Title</h4>
          @if(isFormMode() ){
          <input formControlName="title" />
          <span class="error"
            >{{ getControlErrors('title') | formErrorsMessage : ERROR_MESSAGES }}
          </span>
          } @else{
          <span>{{ ticket?.title }}</span>
          }
        </section>
        <section>
          <h4>Description</h4>
          @if(isFormMode() ){
          <textarea formControlName="description"></textarea>
          <span class="error"
            >{{ getControlErrors('description') | formErrorsMessage : ERROR_MESSAGES }}
          </span>
          } @else{
          <span>{{ ticket?.description }}</span>
          }
        </section>
        <section>
          <h4>Type</h4>
          @if(isFormMode() ){
          <select formControlName="type">
            @for( option of ticketTypes; track option ){
            <option [value]="option">
              {{ option }}
            </option>
            }
          </select>
          <span class="error"
            >{{ getControlErrors('type') | formErrorsMessage : ERROR_MESSAGES }}
          </span>
          } @else{
          <span>{{ ticket?.type }}</span>
          }
        </section>
        <section>
          <h4>Assigned to</h4>
          @if(isFormMode() ){
          <input formControlName="assignee" />
          <span class="error"
            >{{ getControlErrors('assignee') | formErrorsMessage : ERROR_MESSAGES }}
          </span>
          } @else{
          <span>{{ ticket?.assignee }}</span>
          }
        </section>
        <div class="actions">
          @if(isFormMode() ){
          <button type="submit" [disabled]="isActionLoading() || form.invalid">Submit</button>
          <button type="button" (click)="onCancel()">Cancel</button>
          } @else{
          <button type="button" (click)="onEdit()">Edit</button>
          }
        </div>
      </form>
      }
    </div>
  `,
  styles: `
 form{
  margin: auto;
  width: 500px;
  border: 1px solid #5555;
  border-radius: 10px;
  margin-top: 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: auto;
  padding: 10px;

textarea{
  height: auto;
  width: 100%;
}
}
h4{
  margin-bottom: 5px;
  border-bottom: 1px solid;
}
section{
  min-height: 80px;
  width: 100%;
}`,
})
export class TicketDetailsPageComponent {
  private fb = inject(FormBuilder);
  private currentTicketResource = rxResource<Ticket | null, { ticketId: string | undefined }>({
    loader: ({ request }) => {
      const ticketId = request.ticketId as string;
      if (!ticketId) {
        return of(null);
      }

      return of({
        id: '',
        title: '[Auth] Implement login',
        description: 'Login feature is missing',
        type: TICKET_TYPES[0],
        assignee: 'Mr Costabello',
        columnId: this.columnId() || '1',
        order: 0,
      });
    },
    request: () => ({ ticketId: this.ticketId() }),
  });

  currentTicket = this.currentTicketResource.asReadonly();
  ticketId = input<string>();
  columnId = input<string>();
  form: FormGroup;
  isActionLoading = signal(false);
  error = signal<string | null>(null);
  ticketTypes = TICKET_TYPES;

  isFormRequested = signal(false);
  isFormMode = computed(() => {
    const doesUserRequestForm = this.isFormRequested();
    const ticket = this.currentTicket.value();

    return doesUserRequestForm || !ticket;
  });

  ERROR_MESSAGES = {
    required: 'This field is required',
    minlength: 'This field must contain at least 5 characters',
    maxlength: 'This field must contain at most 50 characters',
  };

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      description: ['', [Validators.maxLength(200)]],
      type: [TICKET_TYPES[0] as TicketType, [Validators.required]],
      assignee: ['', [Validators.maxLength(50)]],
    });

    effect(() => {
      const isLoading = this.isActionLoading();
      if (isLoading) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });

    effect(() => {
      const ticket = this.currentTicket.value();
      if (ticket) {
        this.form.reset(ticket);
      }
    });
  }

  getControlErrors(controlName: string) {
    const control = this.form.get(controlName);
    return (control?.touched && control.errors) || null;
  }

  private resetForm() {
    const ticket = this.currentTicket.value();
    if (ticket) {
      this.form.reset(ticket);
    } else {
      this.form.reset({
        type: TICKET_TYPES[0],
      });
    }
  }

  onSubmit() {}

  onCancel() {
    this.resetForm();
    if (this.currentTicket.value()) {
      this.isFormRequested.set(false);
    }
  }

  onEdit() {
    this.isFormRequested.set(true);
  }
}
