import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HeaderComponent } from '../../app/layout/features/header.component';
import { AuthStore } from '../../app/identity/data/auth.store';
import { By } from '@angular/platform-browser';
import { AuthStoreType, getAuthStoreSpyObj } from '../helper';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let mockStore: jasmine.SpyObj<AuthStoreType>;

  beforeEach(async () => {
    mockStore = getAuthStoreSpyObj();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: AuthStore, useValue: mockStore }, provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should display/hide form, depending on user information', fakeAsync(() => {
    const isComponentVisible = fixture.componentInstance.isLoginFormVisible;

    const select = () => {
      fixture.detectChanges();
      return fixture.debugElement.query(By.css('.modal-wrapper'));
    };

    expect(isComponentVisible()).toBeFalse();
    expect(select()).toBeNull();

    fixture.componentInstance.onToggleAuth();
    expect(isComponentVisible()).toBeTrue();
    expect(select()).toBeTruthy();

    mockStore.isUserConnected.set(true);
    expect(isComponentVisible()).toBeFalse();
    expect(select()).toBeNull();
  }));

  it('should logout on user card click, being logged in', () => {
    mockStore.isUserConnected.set(true);
    fixture.componentInstance.onToggleAuth();
    expect(mockStore.logout).toHaveBeenCalled();
  });

  it('should reset error on user card click not being logged in', () => {
    mockStore.isUserConnected.set(false);
    fixture.componentInstance.onToggleAuth();
    expect(mockStore.resetError).toHaveBeenCalled();
  });

  it('should call login method on form submit', fakeAsync(() => {
    const email = 'email';
    const password = 'password';
    fixture.componentInstance.onSubmitForm({ email, password });
    expect(mockStore.login).toHaveBeenCalledWith({
      email,
      password,
    });
  }));
});
