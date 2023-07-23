import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { Post } from 'src/model/post';
import { HttpErrorResponse } from '@angular/common/http';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let userService: jasmine.SpyObj<UserService>;

  const mockError: HttpErrorResponse = {
    statusText: 'test',
  } as HttpErrorResponse;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getToken']);
    userServiceSpy.getToken.and.returnValue({
      userConnected: {
        token: 'abc123',
      },
    });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService as any);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all posts', () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        description: 'Test',
        flair: 'Test',
        image: 'test.png',
        owner: 'owner1',
      } as unknown as Post,
      {
        id: '2',
        description: 'Test',
        flair: 'Test',
        image: 'test.png',
        owner: 'owner2',
      } as unknown as Post,
    ];

    service.getAllPosts().subscribe((x) => {});

    const req = httpMock.expectOne(service.postUrl);

    expect(req.request.method).toBe('GET');

    req.flush(mockPosts);
  });

  it('should get all posts with a flair', () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        description: 'Test',
        flair: 'Test',
        image: 'test.png',
        owner: 'owner1',
      } as unknown as Post,
      {
        id: '2',
        description: 'Test',
        flair: 'Test',
        image: 'test.png',
        owner: 'owner2',
      } as unknown as Post,
    ];

    service.getAllPosts(service.postUrl, 'funny').subscribe((x) => {});

    const req = httpMock.expectOne(`${service.postUrl}?flair=funny`);

    expect(req.request.method).toBe('GET');

    req.flush(mockPosts);
  });

  it('should get a post', () => {
    const mockPost: Post = {
      id: '1',
      description: 'Test',
      flair: 'Test',
      image: 'test.png',
      owner: 'owner1',
    } as unknown as Post;

    service.getPost('1').subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${service.postUrl}/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockPost);
  });

  it('should delete a post', () => {
    service.deletePost('1').subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service.postUrl}/1`);

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush({});
  });

  it('should create a Post', () => {
    const post: Post = {
      description: 'test post',
      flair: 'funny',
      image: 'test.jpg',
    } as unknown as Post;

    service.createPost(new FormData()).subscribe((response) => {
      expect(response).toEqual(post);
    });

    const req = httpMock.expectOne((request) => request.method === 'POST');
    req.flush(post);
  });

  it('should update a post', () => {
    const mockPost: Post = {
      id: '1',
      description: 'Test',
      flair: 'Test',
      image: 'test.png',
      owner: 'owner1',
    } as unknown as Post;

    service
      .updatePost({ description: 'Test Updated' }, '1')
      .subscribe((post) => {
        expect(post).toEqual(mockPost);
      });

    const req = httpMock.expectOne(`${service.postUrl}/1`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush(mockPost);
  });

  it('should add a post to favorites', () => {
    const mockPost: Post = {
      id: '1',
      description: 'Test',
      flair: 'Test',
      image: 'test.png',
      owner: 'owner1',
    } as unknown as Post;

    service.addToFavorites(mockPost, '1').subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${service.postUrl}/addfavorite/1`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush(mockPost);
  });

  it('should remove a post from favorites', () => {
    const mockPost: Post = {
      id: '1',
      description: 'Test',
      flair: 'Test',
      image: 'test.png',
      owner: 'owner1',
    } as unknown as Post;

    service.removeFromFavorites(mockPost, '1').subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${service.postUrl}/removefavorite/1`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush(mockPost);
  });

  it('should add a comment', () => {
    const mockPost: Post = {
      id: '1',
      description: 'Test',
      flair: 'Test',
      image: 'test.png',
      owner: 'owner1',
    } as unknown as Post;

    const comment = { comment: 'comment that is looking good' };

    service.addComment(comment, '1').subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${service.postUrl}/addcomment/1`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush(mockPost);
  });

  describe('When the handleError method is called', () => {
    it('Should return the error message', () => {
      service.handleError(mockError).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(mockError.statusText).toBe('test');
        },
      });
    });
  });
});
