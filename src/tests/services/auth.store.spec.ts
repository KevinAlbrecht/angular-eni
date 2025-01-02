import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthApiService } from '../../app/identity/data/auth-api.service';
import { delay, of, throwError } from 'rxjs';
import { AuthStore } from '../../app/identity/data/auth.store';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthApiService', () => {
  let serviceSpy: jasmine.SpyObj<AuthApiService>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('AuthApiService', ['login', 'logout']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthApiService, useValue: serviceSpy }, AuthStore],
    });

    localStorageSpy = jasmine.createSpyObj<Storage>('localStorage', [
      'getItem',
      'setItem',
      'removeItem',
      'clear',
    ]);
    spyOnProperty(window, 'localStorage').and.returnValue(localStorageSpy);
  });

  it('should log in, retrieving user and storing the auth token', fakeAsync(() => {
    const userMock = { username: 'user', isAdmin: false };
    const authTokenMock = 'auth-token';

    serviceSpy.login.and.returnValue(
      of({ authToken: authTokenMock, user: userMock }).pipe(delay(200))
    );
    const { user, authToken, isLoggingin, login } = TestBed.inject(AuthStore);

    expect(user()).toBeNull();
    expect(authToken()).toBeNull();

    login({ email: 'email', password: 'password' });

    tick(100);
    expect(isLoggingin()).toBeTrue();
    tick(100);
    expect(isLoggingin()).toBeFalse();

    expect(user()).toEqual(userMock);
    expect(authToken()).toBe(authTokenMock);
    expect(serviceSpy.login).toHaveBeenCalledOnceWith('email', 'password');
    expect(localStorageSpy.setItem).toHaveBeenCalledOnceWith('auth_token', authTokenMock);
  }));

  it('should log out, cleaning information', fakeAsync(() => {
    serviceSpy.login.and.returnValue(
      of({ authToken: 'auth-token', user: { username: 'user', isAdmin: true } })
    );
    serviceSpy.logout.and.returnValue(of({}).pipe(delay(200)));

    const { user, authToken, isLoggingin, logout, login } = TestBed.inject(AuthStore);

    login({ email: 'email', password: 'password' });
    logout();

    tick(100);
    expect(isLoggingin()).toBeTrue();
    tick(100);

    expect(isLoggingin()).toBeFalse();
    expect(user()).toBeNull();
    expect(authToken()).toBeNull();
    expect(serviceSpy.logout).toHaveBeenCalled();
    expect(localStorageSpy.removeItem).toHaveBeenCalledOnceWith('auth_token');
  }));

  it('should set an error when failing to log in', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    serviceSpy.login.and.returnValue(throwError(() => errorResponse));

    const { user, error, login } = TestBed.inject(AuthStore);
    login({ email: '', password: '' });
    tick(100);
    expect(user()).toBeNull();
    expect(error()).toBe(errorResponse.message);
  }));

  it('should reset the error', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    serviceSpy.login.and.returnValue(throwError(() => errorResponse));

    const { resetError, error, login } = TestBed.inject(AuthStore);
    login({ email: '', password: '' });
    tick(100);
    resetError();
    expect(error()).toBeNull();
  }));
});
