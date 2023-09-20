import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { of, take, tap, Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PublicAuthChecking = ( ():Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthenticationStatus()
    .pipe(
      take(1),
      tap( isAuthenticated => {
        console.log(isAuthenticated);
        if (isAuthenticated) router.navigate(['./']);
      }),
      // Como este guard vale solo para no mostrar el login mientras esta autenticado, a diferencia del auth guard
      // debemos de usar el map para alterar el resultado de salida. Es decir, queremos devolver lo contrario a si esta
      // o no autenticado.
      map( isAuthenticaded => !isAuthenticaded)
    );
});

export const PublicGuardCanMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  return PublicAuthChecking();
}

export const PublicGuardCanActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return PublicAuthChecking();
}
