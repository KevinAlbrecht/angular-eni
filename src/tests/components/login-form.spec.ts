import { ValidationErrors } from '@angular/forms';
import { LoginFormComponent } from '../../app/identity/ui/login-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fillForm } from '../helper';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component with default form values', () => {
    expect(component).toBeTruthy();
    expect(component.form.get('email')?.value).toEqual('');
    expect(component.form.get('password')?.value).toEqual('');
    expect(component.form.disabled).toBeFalse();
  });

  it('should disable form depending on isLoading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.form.disabled).toBeTrue();
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    expect(component.form.disabled).toBeFalse();
  });

  it('should not emit submitForm when form is invalid', () => {
    spyOn(component.submitForm, 'emit');
    fillForm(component.form, { email: '' }, fixture);
    component.onSubmit();
    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });

  it('should not emit submitForm when isLoading is true', () => {
    spyOn(component.submitForm, 'emit');
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    component.onSubmit();
    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });

  it('should return control errors when email empty or invalid', () => {
    const tests: [string, ValidationErrors | null][] = [
      ['', { required: true }],
      ['invalid-email', { email: true }],
    ];

    tests.forEach(([email, error]) => {
      fillForm(component.form, { email }, fixture);
      expect(component.getControlErrors('email')).toEqual(error);
    });
  });

  it('should return control errors when password empty', () => {
    fillForm(component.form, { password: '' }, fixture);
    expect(component.getControlErrors('password')).toEqual({ required: true });
  });

  it('should emit submitForm with form value when onSubmit is called', () => {
    const email = 'test@example.com',
      password = 'password';

    spyOn(component.submitForm, 'emit');
    fillForm(component.form, { email, password }, fixture);
    component.onSubmit();
    expect(component.submitForm.emit).toHaveBeenCalledWith({
      email,
      password,
    });
  });

  it('should not emit submitForm when form is invalid ', () => {
    spyOn(component.submitForm, 'emit');
    fillForm(component.form, { email: '' }, fixture);
    component.onSubmit();
    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });

  it('should reset form and emit close event when onCancel is called', () => {
    spyOn(component.close, 'emit');
    fillForm(component.form, { email: 'test@example.com', password: '1234' }, fixture);
    component.onCancel();
    expect(component.form.get('email')?.value).toEqual(null);
    expect(component.form.get('password')?.value).toEqual(null);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should display error message when error is not null', () => {
    const errorMsg = 'Invalid credentials';
    fixture.componentRef.setInput('error', errorMsg);
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('p.error');
    expect(errorElement?.textContent).toContain(errorMsg);
  });
});
