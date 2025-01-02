import { HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../app/identity/auth.interceptor';
import { AuthStore } from '../../app/identity/data/auth.store';
import { AuthStoreType, getAuthStoreSpyObj } from '../helper';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('authInterceptor', () => {
  const mockRequest = new HttpRequest('GET', '/api/data');
  let mockStore: jasmine.SpyObj<AuthStoreType>;
  let mockNext: any = (request: HttpRequest<unknown>) => {};

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
