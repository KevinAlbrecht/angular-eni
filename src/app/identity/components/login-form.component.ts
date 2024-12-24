import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginFormValue } from '../models';
import { FormErrorsMessagePipe } from '../../shared/pipes/form-errors-message.pipe';

@Component({
  selector: 'app-login-form',
  imports: [FormErrorsMessagePipe, ReactiveFormsModule],
  template: `
    <div id="wrapper">
      <h3>Login</h3>
      <span>Log in to access the kanban board</span>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="control-wrapper">
          <div class="field">
            <label>Email :</label>
            <input formControlName="email" type="email" />
          </div>
          <span class="error">{{
            getControlErrors('email') | formErrorsMessage : ERROR_MESSAGES
          }}</span>
        </div>
        <div class="control-wrapper">
          <div class="field">
            <label>Password :</label>
            <input formControlName="password" type="password" />
          </div>
          <span class="error">{{
            getControlErrors('password') | formErrorsMessage : ERROR_MESSAGES
          }}</span>
        </div>
        <div class="actions">
          <button type="submit" [disabled]="isLoading() || form.invalid">Log in</button>
          <button type="button" [disabled]="isLoading()" (click)="onCancel()">Cancel</button>
        </div>
        @if(error(); as errorMessage){
        <p class="error">{{ errorMessage }}</p>
        }
      </form>
    </div>
  `,
  styles: `
#wrapper {
 min-height: 200px;
 form{
   display: flex;
   flex-direction: column;
   gap: 20px;
   align-items: center;
   margin-top: 50px;
   input.ng-touched.ng-invalid {
     border: 1px solid red;
   }
   .control-wrapper{
     width:250px;
     .field{
      display: flex;
      justify-content: space-between;
     }
     .error{
       color:red;
     }
   }
   .actions{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
    gap: 50px;
   }
 }
}`,
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  form: FormGroup;
  isLoading = input(false);
  error = input<string | null>(null);
  submitForm = output<LoginFormValue>();
  close = output<void>();

  ERROR_MESSAGES = {
    required: 'This field is required',
    email: 'The email format is incorrect',
  };

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    effect(() => {
      const isLoading = this.isLoading();
      if (isLoading) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  getControlErrors(controlName: string) {
    const control = this.form.get(controlName);
    return (control?.touched && control.errors) || null;
  }

  onSubmit() {
    if (this.form.invalid || this.isLoading()) {
      return;
    }

    this.submitForm.emit(this.form.value);
  }

  onCancel() {
    this.form.reset();
    this.close.emit();
  }
}
