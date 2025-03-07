import { HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthStoreType, getAuthStoreSpyObj } from '../helper';

import { authInterceptor } from '~identity/auth.interceptor';
import { AuthStore } from '~identity/data/auth.store';

describe('authInterceptor', () => {
  const mockRequest = new HttpRequest('GET', '/api/data');
  let mockStore: jasmine.SpyObj<AuthStoreType>;
  let mockNext: jasmine.Spy<jasmine.Func>;

  beforeEach(() => {
    mockStore = getAuthStoreSpyObj();
    mockNext = jasmine.createSpy();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: mockStore },
      ],
    });
  });

  it('should add Authorization header with token when token is available', () => {
    mockStore.authToken.set('token');
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext);
    });

    expect(mockNext).toHaveBeenCalledWith(
      mockRequest.clone({ setHeaders: { Authorization: 'Bearer token' } })
    );
  });

  it('should not add Authorization header when token is not available', () => {
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext);
    });
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });
});
