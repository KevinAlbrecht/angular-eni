import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthApiService } from '../../app/identity/data/auth-api.service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthApiService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthApiService);
  });

  it('should send a POST request to /api/login with email and password', () => {
    const email = 'test@example.com';
    const password = 'password';

    service.login(email, password).subscribe();

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush({});
  });

  it('should send a POST request to /api/logout', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne('/api/logout');
    expect(req.request.method).toBe('POST');

    req.flush({});
  });
});
