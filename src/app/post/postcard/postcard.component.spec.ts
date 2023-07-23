import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostcardComponent } from './postcard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { Post } from 'src/model/post';
import { PostService } from 'src/app/services/post/post.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoggedUser } from 'src/model/token';
import { UserService } from 'src/app/services/user/user.service';
import { SocketService } from 'src/app/services/socket/socket.service';

describe('PostcardComponent', () => {
  let component: PostcardComponent;
  let fixture: ComponentFixture<PostcardComponent>;
  let postService: PostService;
  let socketService: SocketService;
  let fakeParamMap = new BehaviorSubject({ get: (key: string) => '1' });
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const mockPostService = {
    getPost: () => of({} as Post),
    deletePost: () => of({}),
    addToFavorites: () => of({}),
    addComment: () => of({}),
  };

  mockUserService = jasmine.createSpyObj<UserService>(['user$']);

  const mockSocket = {
    on: jasmine.createSpy('on'),
    emit: jasmine.createSpy('emit'),
    off: jasmine.createSpy('off'),
  };

  const mockSocketService = {
    getSocket: () => mockSocket,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FontAwesomeTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [PostcardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: fakeParamMap.asObservable(),
            params: of({ id: '1' }),
          },
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: PostService,
          useValue: mockPostService,
        },
        {
          provide: SocketService,
          useValue: mockSocketService,
        },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(PostcardComponent);
    postService = TestBed.inject(PostService);
    socketService = TestBed.inject(SocketService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post on init', () => {
    spyOn(postService, 'getPost').and.returnValue(of({} as Post));
    component.ngOnInit();
    expect(postService.getPost).toHaveBeenCalledWith('1');
    expect(component.post).toEqual({} as Post);
  });

  it('should navigate to error route when getPost fails', () => {
    spyOn(postService, 'getPost').and.returnValue(throwError('Error'));
    component.loadPost();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['error']);
  });

  it('should call socket.on with the correct event on init', () => {
    spyOn(socketService, 'getSocket').and.returnValue(mockSocket as any);

    component.ngOnInit();
    mockSocket.on.calls.mostRecent().args[1]();

    expect(mockSocket.on).toHaveBeenCalled();
    expect(component.post).toEqual({} as Post);
  });

  it('should refresh the post when a commentCreated event is received', () => {
    const mockPost: Post = {
      id: '1',
      description: 'test',
      image: { url: 'test.jpg' },
      owner: { userName: 'marquito', avatar: { url: 'text.jpg' } },
      flair: 'test',
    } as Post;

    spyOn(socketService, 'getSocket').and.returnValue(mockSocket as any);
    spyOn(postService, 'getPost').and.returnValue(of(mockPost));

    component.ngOnInit();
    mockSocket.on.calls.first().args[1]();

    expect(postService.getPost).toHaveBeenCalledWith('1');
    expect(component.post).toEqual(mockPost);
  });

  it('should call deletePost method on service with correct parameters', () => {
    spyOn(mockPostService, 'deletePost').and.callThrough();
    component.deletePost();
    expect(mockPostService.deletePost).toHaveBeenCalled();
  });

  it('should navigate to posts route after successful deletion', () => {
    component.deletePost();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts']);
  });

  it('should navigate to posts route when a postDeleted event is received', () => {
    spyOn(socketService, 'getSocket').and.returnValue(mockSocket as any);

    component.ngOnInit();

    expect(mockSocket.on).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts']);
  });

  it('should show an alert if deletePost fails', () => {
    spyOn(mockPostService, 'deletePost').and.returnValue(throwError('Error'));
    const spy = spyOn(Swal, 'fire');
    component.deletePost();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to edit post page', () => {
    component.handleEditPost();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should navigate back to post page', () => {
    component.handleReturntoPosts();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should add post to favorites when loggedInUser is not null', () => {
    const post: Post = {
      id: '1',
      description: 'test',
      image: { url: 'test.jpg' },
      owner: { userName: 'marquito', avatar: { url: 'text.jpg' } },
      flair: 'test',
    } as Post;
    component.post = post;

    component.loggedInUser = {
      userConnected: {
        token: '123',
        user: {
          id: 'user1',
        },
      },
    };

    spyOn(mockPostService, 'addToFavorites').and.returnValue(of({}));
    const spy = spyOn(Swal, 'fire');

    component.handleAddToFavorites();

    expect(mockPostService.addToFavorites).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should not add post to favorites when loggedInUser is null', () => {
    const post: Post = {
      id: '1',
      description: 'test',
      image: { url: 'test.jpg' },
      owner: { userName: 'marquito', avatar: { url: 'text.jpg' } },
      flair: 'test',
    } as Post;
    component.post = post;

    component.loggedInUser = null;

    spyOn(mockPostService, 'addToFavorites').and.returnValue(
      throwError('error')
    );
    const spy = spyOn(Swal, 'fire');

    component.handleAddToFavorites();

    expect(mockPostService.addToFavorites).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should set user to null on init', () => {
    let loggedUser = null;

    let user$ = new BehaviorSubject<LoggedUser | null>(loggedUser);

    mockUserService.user$ = user$;

    component.ngOnInit();

    expect(component.loggedInUser).toBe(null);
  });

  it('should not add post to favorites when loggedInUser is null', () => {
    const post: null = null;
    component.post = post;

    component.loggedInUser = {
      userConnected: {
        token: '123',
        user: {
          id: 'user1',
        },
      },
    };

    spyOn(mockPostService, 'addToFavorites').and.returnValue(null as any);
    const spy = spyOn(Swal, 'fire');

    component.handleAddToFavorites();

    expect(mockPostService.addToFavorites).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add comment when form is valid', () => {
    const comment = 'GREAT SUCCEESSSS!';
    component.comment.setValue({ comment });

    spyOn(mockPostService, 'addComment').and.returnValue(of({}));
    const swalSpy = spyOn(Swal, 'fire');

    component.handleAddComment();

    expect(mockPostService.addComment).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('should not add comment when form is invalid', () => {
    component.comment.setValue({ comment: '' });

    spyOn(mockPostService, 'addComment').and.returnValue(of({}));
    const swalSpy = spyOn(Swal, 'fire');

    component.handleAddComment();

    expect(mockPostService.addComment).not.toHaveBeenCalled();
    expect(swalSpy).not.toHaveBeenCalled();
  });

  it('should show an error alert if adding comment fails', () => {
    const comment = 'my wife, very good!';
    component.comment.setValue({ comment });

    spyOn(mockPostService, 'addComment').and.returnValue(throwError('Error'));
    const swalSpy = spyOn(Swal, 'fire');

    component.handleAddComment();

    expect(mockPostService.addComment).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalled();
  });
});

describe('PostcardComponent', () => {
  let component: PostcardComponent;
  let fixture: ComponentFixture<PostcardComponent>;
  let fakeParamMap = new BehaviorSubject({ get: (key: string) => '1' });
  let mockUserService: jasmine.SpyObj<UserService>;

  mockUserService = jasmine.createSpyObj<UserService>(['user$']);

  beforeEach(() => {
    const loggedInUser = {
      userConnected: {
        token: '123',
        user: {
          id: 'user1',
        },
      },
    };

    const user$ = new BehaviorSubject<LoggedUser | null>(loggedInUser);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FontAwesomeTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [PostcardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: fakeParamMap.asObservable(),
            params: of({ id: '1' }),
          },
        },
        {
          provide: UserService,
          useValue: {
            user$: user$.asObservable(),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(PostcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set user to user on init', () => {
    let loggedInUser = {
      userConnected: {
        token: '123',
        user: {
          id: 'user1',
        },
      },
    };

    let user$ = new BehaviorSubject<LoggedUser | null>(loggedInUser);

    mockUserService.user$ = user$;

    component.ngOnInit();

    expect(component.loggedInUser).toEqual(loggedInUser);
  });
});
