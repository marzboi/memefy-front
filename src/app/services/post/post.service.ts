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
import { Post, PostResponse } from 'src/model/post';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public postUrl = 'https://memefy-7rmx.onrender.com/post';
  allPost$: BehaviorSubject<Post[] | null>;
  next$: BehaviorSubject<string | null>;
  previous$: BehaviorSubject<string | null>;
  post$: BehaviorSubject<Post | null>;
  constructor(private http: HttpClient, private userService: UserService) {
    this.allPost$ = new BehaviorSubject<Post[] | null>(null);
    this.post$ = new BehaviorSubject<Post | null>(null);
    this.next$ = new BehaviorSubject<string | null>(null);
    this.previous$ = new BehaviorSubject<string | null>(null);
  }

  getAllPosts(url = this.postUrl, flair?: string): Observable<Post[]> {
    let urlToSend;
    !flair ? (urlToSend = url) : (urlToSend = `${url}?flair=${flair}`);
    return this.http.get<PostResponse>(urlToSend).pipe(
      map((answer) => {
        this.allPost$.next(answer.items);
        this.next$.next(answer.next);
        this.previous$.next(answer.previous);
        return answer.items as Post[];
      })
    );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(this.postUrl + '/' + id).pipe(
      tap((answer) => {
        this.post$.next(answer);
      })
    );
  }

  deletePost(id: string): Observable<any> {
    const user = this.userService.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );
    return this.http.delete(this.postUrl + '/' + id, { headers: headers }).pipe(
      tap(() => {
        this.post$.next(null);
      })
    );
  }

  createPost(post: FormData): Observable<Post> {
    const user = this.userService.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );

    return this.http
      .post<Post>(this.postUrl, post, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  updatePost(post: Partial<Post>, id: string): Observable<Post> {
    const user = this.userService.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );

    return this.http
      .patch<Post>(this.postUrl + '/' + id, post, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  addToFavorites(post: Post, id: string) {
    const user = this.userService.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );

    return this.http
      .patch<Post>(this.postUrl + '/addfavorite/' + id, post, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
  }

  removeFromFavorites(post: Post, id: string) {
    const user = this.userService.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );

    return this.http
      .patch<Post>(this.postUrl + '/removefavorite/' + id, post, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
  }

  addComment(post: { comment: string }, id: string) {
    const user = this.userService.getToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${user.userConnected.token}`
    );

    return this.http
      .patch<Post>(this.postUrl + '/addcomment/' + id, post, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => `${error.statusText}`);
  }
}
