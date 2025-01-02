import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, Route, provideRouter } from '@angular/router';
import { authGuard } from '../../app/identity/auth.guard';
import { AuthStoreType, getAuthStoreSpyObj } from '../helper';
import { AuthStore } from '../../app/identity/data/auth.store';

const testingRoutes = [
  { path: '', component: class {} },
  { path: 'board', component: class {} },
] as Route[];

describe('AuthGuard', () => {
  let mockStore: jasmine.SpyObj<AuthStoreType>;
  let mockSnapshot: Partial<ActivatedRouteSnapshot>;

  beforeEach(async () => {
    mockStore = getAuthStoreSpyObj();
    mockSnapshot = { data: {} };

    TestBed.configureTestingModule({
      providers: [provideRouter(testingRoutes), { provide: AuthStore, useValue: mockStore }],
    });
  });

  it('should redirect to home page when user is not connected', () => {
    const snapshots = [{ data: {} }, { data: { requiresAdmin: true } }];

    snapshots.forEach((snapshot) => {
      const result = TestBed.runInInjectionContext(() => {
        return authGuard(snapshot as ActivatedRouteSnapshot, {} as any);
      });

      expect(result).toBeInstanceOf(RedirectCommand);
      expect((result as RedirectCommand).redirectTo.toString()).toBe('/');
    });
  });

  it('should accept navigation when connected and only when admin not required', () => {
    mockStore.isUserConnected.set(true);
    mockStore.isUserAdmin.set(false);
    const snapshots = [
      [{ data: {} }, true],
      [{ data: { requiresAdmin: true } }, false],
    ];

    snapshots.forEach(([snapshot, shouldPass]) => {
      const result = TestBed.runInInjectionContext(() => {
        return authGuard(snapshot as ActivatedRouteSnapshot, {} as any);
      });

      if (shouldPass) {
        expect(result).toBeTrue();
      } else {
        expect(result).toBeInstanceOf(RedirectCommand);
        expect((result as RedirectCommand).redirectTo.toString()).toBe('/');
      }
    });
  });

  it('should accept navigation when connected and admin', () => {
    mockStore.isUserConnected.set(true);
    mockStore.isUserAdmin.set(true);

    const snapshots = [{ data: {} }, { data: { requiresAdmin: true } }];

    snapshots.forEach((snapshot) => {
      const result = TestBed.runInInjectionContext(() => {
        return authGuard(snapshot as ActivatedRouteSnapshot, {} as any);
      });

      expect(result).toBeTrue();
    });
  });
});
