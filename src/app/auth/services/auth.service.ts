import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, of, tap, map, catchError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor( private http: HttpClient ) { }

  get currentUser (): User | undefined {
    if ( !this.user ) return undefined;
    //return {...this.user};

    // Desde la versión 17 de node, podemos usar la función structuredClone
    // para devolver un clon identico del objeto en cuestión, para evitar que al pasarse
    // por referencia se alteren sus propiedades. Sno podemos usar el operador spread {...this.user}
    return structuredClone(this.user);
  }

  login( email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`) // De momento no se hace login en este ejemplo, llamamos directamente al get de los datos
      .pipe(
        tap( user => this.user = user ),
        tap( user => localStorage.setItem('token', user.id.toString()) )
      );
  }

  checkAuthenticationStatus(): Observable<boolean> {
    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/${token}`)
      .pipe(
        tap( user => this.user = user),
        map( user => !!user), // Con la doble negación lo que estamos haciendo es asegurarnos de que el objeto user tiene valores
        catchError( error => of(false))
      )
  }

  logout(): void {
    this.user = undefined;
    localStorage.clear();
  }

}
