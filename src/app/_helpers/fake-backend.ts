import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';


import { User, Role } from '@app/_models';

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin2020',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@onlineacademy.ca',
    role: Role.Admin,
  },
  {
    id: 2,
    username: 'user',
    password: 'user2020',
    firstName: 'Normal',
    lastName: 'User',
    email: 'user@onlineacademy.ca',
    role: Role.User,
  },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const { url, method, headers, body } = request;

      // wrap in delayed observable to simulate server api call
      return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

      // tslint:disable-next-line:typedef
      function handleRoute() {
        switch (true) {
          case url.endsWith('/users/authenticate') && method === 'POST':
            return authenticate();
          case url.endsWith('/users') && method === 'GET':
            return getUsers();
          case url.match(/\/users\/\d+$/) && method === 'GET':
            return getUserById();
          case url.endsWith('/users/register') && method === 'POST':
            return register();
          default:
            // pass through any requests not handled above
            return next.handle(request);
        }
      }

      // route functions

      // tslint:disable-next-line:typedef
      function authenticate() {
        const { username, password } = body;
        const user = users.find(
          (x) => x.username === username && x.password === password
        );
        if (!user) {
          return error('Username or password is incorrect');
        }
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          token: `fake-jwt-token.${user.id}`,
        });
      }

      // tslint:disable-next-line:typedef
      function register() {
        const user = body;

        if (users.find((x) => x.username === user.username)) {
          return error('Username "' + user.username + '" is already taken');
        }

        user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return ok(body);
      }

      // helper functions

      function getUsers() {
        if (!isAdmin()) {
          return unauthorized();
        }
        return ok(users);
      }

      function getUserById() {
        if (!isLoggedIn()) {
          return unauthorized();
        }

        // only admins can access other user records
        if (!isAdmin() && currentUser().id !== idFromUrl()) {
          return unauthorized();
        }

        const user = users.find((x) => x.id === idFromUrl());
        return ok(user);
      }

      // helper functions

      function ok(body) {
        return of(new HttpResponse({ status: 200, body }));
      }

      function unauthorized() {
        return throwError({
          status: 401,
          error: { message: 'unauthorized' },
        });
      }

      // tslint:disable-next-line:typedef
      function error(message) {
        return throwError({ status: 400, error: { message } });
      }

      // tslint:disable-next-line:typedef
      function isLoggedIn() {
        const authHeader = headers.get('Authorization') || '';
        return authHeader.startsWith('Bearer fake-jwt-token');
      }
      // tslint:disable-next-line:typedef
      function isAdmin() {
        return isLoggedIn() && currentUser().role === Role.Admin;
      }
      // tslint:disable-next-line:typedef
      function currentUser() {
        if (!isLoggedIn()) {
          return;
        }
        // tslint:disable-next-line:radix
        const id = parseInt(headers.get('Authorization').split('.')[1]);
        return users.find((x) => x.id === id);
      }
      // tslint:disable-next-line:typedef
      function idFromUrl() {
        const urlParts = url.split('/');
        // tslint:disable-next-line:radix
        return parseInt(urlParts[urlParts.length - 1]);
      }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
