import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { Post } from 'src/model/post';
import { LoggedUser, LoginAnswer } from 'src/model/token';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private register = 'https://memefy-7rmx.onrender.com/user/register';
  private login = 'https://memefy-7rmx.onrender.com/user/login';
  private url = 'https://memefy-7rmx.onrender.com/user/';
  user$: BehaviorSubject<LoggedUser | null>;
  favorites$: BehaviorSubject<Post[] | null>;

  constructor(private http: HttpClient) {
    this.user$ = new BehaviorSubject<LoggedUser | null>(null);
    this.favorites$ = new BehaviorSubject<Post[] | null>(null);
  }

  registerUser(user: FormData): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(this.register, user)
      .pipe(catchError(this.handleError));
  }

  loginUser(user: Partial<User>): Observable<LoggedUser> {
    return this.http.patch<LoginAnswer>(this.login, user).pipe(
      map((answer) => ({
        userConnected: { token: answer.token, user: answer.user },
      })),
      tap((loggedUser) => {
        localStorage.setItem('userConnected', JSON.stringify(loggedUser));
        this.user$.next(loggedUser);
      }),
      catchError(this.handleError)
    );
  }

  getToken() {
    const localUser = localStorage.getItem('userConnected');
    if (localUser === null) {
      return throwError(() => 'User not connected');
    }
    return JSON.parse(localUser);
  }

  logoutUser(): void {
    localStorage.removeItem('userConnected');
    this.user$.next(null);
  }

  loadUserFavorites() {
    const user = this.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );

    return this.http
      .get<User>(this.url + user.userConnected.user.id, { headers: headers })
      .pipe(
        map((answer) => {
          this.favorites$.next(answer.favoritePost);
          return answer.favoritePost;
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => `${error.statusText}`);
  }
}
