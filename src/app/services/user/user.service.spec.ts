import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from 'src/model/user';
import { LoggedUser, LoginAnswer } from 'src/model/token';
import { HttpErrorResponse } from '@angular/common/http';
import { Post } from 'src/model/post';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const user: User = {
      userName: 'Nitin',
      passwd: 'Antonio',
      email: 'Nitin@Antonio.com',
    } as User;
    service.registerUser(new FormData()).subscribe((response) => {
      expect(response.user).toEqual(user);
    });

    const req = httpMock.expectOne((request) => request.method === 'POST');
    req.flush({ user });
  });

  it('should login a user', () => {
    const user: Partial<User> = { userName: 'epale', passwd: 'memes' };
    const expectedResponse: LoginAnswer = { user: user, token: 'abc123' };
    service.loginUser(user).subscribe((response) => {
      expect(response).toEqual({ userConnected: expectedResponse });
    });

    const req = httpMock.expectOne((request) => request.method === 'PATCH');
    req.flush(expectedResponse);
  });

  it('should logout a user', () => {
    spyOn(localStorage, 'removeItem');
    service.logoutUser();
    expect(localStorage.removeItem).toHaveBeenCalledWith('userConnected');
  });

  it('should get token when user is connected', () => {
    const mockUser: LoggedUser = {
      userConnected: {
        token: 'abc123',
        user: { userName: 'colega', passwd: 'gpt' },
      },
    };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    const token = service.getToken();
    expect(token).toEqual(mockUser);
  });

  it('should throw error when user is not connected', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    service.getToken().subscribe(
      () => fail('should have failed with User not connected'),
      (error: any) => expect(error).toContain('User not connected')
    );
  });

  it('should handle error', () => {
    const mockError: HttpErrorResponse = {
      status: 404,
      statusText: 'Not Found',
    } as HttpErrorResponse;
    service.handleError(mockError).subscribe(
      () => fail('should have failed with 404 error'),
      (error) => expect(error).toContain('Not Found')
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load user favorites', () => {
    const user: LoggedUser = {
      userConnected: {
        token: 'abc123',
        user: { userName: 'test', passwd: 'test', id: 'testId' },
      },
    };
    const favoritePosts: Post[] = [
      {
        id: 'postId',
      },
    ] as Post[];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    spyOn(service, 'getToken').and.returnValue(user);

    service.loadUserFavorites().subscribe((response) => {
      expect(response).toEqual(favoritePosts);
    });

    const req = httpMock.expectOne(
      `https://memefy-7rmx.onrender.com/user/${user.userConnected.user.id}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toEqual(
      `Bearer ${user.userConnected.token}`
    );
    req.flush({ favoritePost: favoritePosts });
  });
});
