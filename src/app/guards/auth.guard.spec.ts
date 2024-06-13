import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: jasmine.createSpy()
          }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation if the user is logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);
    
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should redirect to login if the user is not logged in', () => {
    const navigateSpy = spyOn(router, 'navigate');
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
