import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateFn } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuardCanActivate, AuthGuardCanMatch } from './auth/guards/auth.guard';
import { PublicGuardCanActivate, PublicGuardCanMatch } from './auth/guards/public.guard';

// localhost:4200
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ), // Lazy loading
    canActivate: [
      PublicGuardCanActivate
    ],
    canMatch: [
      PublicGuardCanMatch
    ]
  }, {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ), // Lazy loading
    canActivate: [
      AuthGuardCanActivate
    ],
    canMatch: [
      AuthGuardCanMatch
    ]
  }, {
    path: '404',
    component: Error404PageComponent
  }, {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full' // Esto se pone para que el path sea exactamente vacio
  }, {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
