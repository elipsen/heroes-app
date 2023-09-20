import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { of, take, tap, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

const GuardAuthChecking = ( ():Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthenticationStatus()
    .pipe(
      take(1),
      tap( isAuthenticated => {
        if (!isAuthenticated) router.navigateByUrl('auth/login');
      })
    );
});

export const AuthGuardCanMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  return GuardAuthChecking();
}

export const AuthGuardCanActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return GuardAuthChecking();
}
