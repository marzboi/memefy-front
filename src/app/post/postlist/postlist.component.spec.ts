import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostlistComponent } from './postlist.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Post } from 'src/model/post';
import { PostService } from 'src/app/services/post/post.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SocketService } from 'src/app/services/socket/socket.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('PostlistComponent', () => {
  let component: PostlistComponent;
  let fixture: ComponentFixture<PostlistComponent>;
  let socketService: SocketService;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  const mockPostService = {
    getAllPosts: () =>
      of([
        { id: 1, title: 'test' } as unknown as Post,
        { id: 2, title: 'test2' } as unknown as Post,
      ]),
    next$: { value: 'http://next-url.com' },
    previous$: { value: 'http://previous-url.com' },
    postUrl: 'http://post-url.com',
  };

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
        FontAwesomeModule,
        RouterTestingModule,
      ],
      declarations: [PostlistComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: SocketService, useValue: mockSocketService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    fixture = TestBed.createComponent(PostlistComponent);
    socketService = TestBed.inject(SocketService);
    component = fixture.componentInstance;
    component.LoadAllPost = component.LoadAllPost.bind(component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    fixture.detectChanges();
    expect(component.postArray?.length).toEqual(2);
    expect(component.nextUrl).toEqual(mockPostService.next$.value);
    expect(component.previusUrl).toEqual(mockPostService.previous$.value);
  });

  it('should call socket.on with the correct event on init', () => {
    spyOn(socketService, 'getSocket').and.returnValue(mockSocket as any);

    component.ngOnInit();
    mockSocket.on.calls.argsFor(0)[1]();

    expect(mockSocket.on).toHaveBeenCalled();
    expect(mockSocket.on).toHaveBeenCalledWith(
      'postCreated',
      jasmine.any(Function)
    );
  });

  it('should call socket.on with the correct event on init', () => {
    spyOn(socketService, 'getSocket').and.returnValue(mockSocket as any);

    component.ngOnInit();
    mockSocket.on.calls.argsFor(1)[1]();

    expect(mockSocket.on).toHaveBeenCalled();
    expect(mockSocket.on).toHaveBeenCalledWith(
      'updatePost',
      jasmine.any(Function)
    );
  });

  it('should load next posts', () => {
    component.nextUrl = 'nextUrl';
    spyOn(component.service, 'getAllPosts').and.returnValue(of([]));
    component.handleLoadNextOrPrevious('nextUrl');
    expect(component.service.getAllPosts).toHaveBeenCalledWith('nextUrl');
  });

  it('should load previous posts', () => {
    component.previusUrl = 'previousUrl';
    spyOn(component.service, 'getAllPosts').and.returnValue(of([]));
    component.handleLoadNextOrPrevious('previousUrl');
    expect(component.service.getAllPosts).toHaveBeenCalledWith('previousUrl');
  });

  it('should load posts with specific flair', () => {
    const flair = 'flair';
    spyOn(component.service, 'getAllPosts').and.returnValue(of([]));
    component.handleLoadFlair(flair);
    expect(component.service.getAllPosts).toHaveBeenCalledWith(
      component.service.postUrl,
      flair
    );
  });

  it('should load all post', () => {
    spyOn(component.service, 'getAllPosts').and.returnValue(of([]));
    component.LoadAllPost();
    expect(component.service.getAllPosts).toHaveBeenCalled();
  });

  describe('', () => {
    const mockPostServiceEmpty = {
      ...mockPostService,
      getAllPosts: () => of([]),
    };
    beforeEach(() => {
      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, FontAwesomeModule],
        providers: [
          { provide: PostService, useValue: mockPostServiceEmpty },
          { provide: SocketService, useValue: mockSocketService },
        ],
      });
      fixture = TestBed.createComponent(PostlistComponent);
      socketService = TestBed.inject(SocketService);
      component = fixture.componentInstance;
    });

    it('should handle no posts on init', () => {
      component.ngOnInit();
      mockSocket.on.calls.mostRecent().args[1]();

      expect(component.postArray?.length).toBe(undefined);
    });

    it('should handle no posts on init', () => {
      component.ngOnInit();
      mockSocket.on.calls.all()[0].args[1]();

      expect(component.postArray?.length).toBe(undefined);
    });
  });
  it('should navigate home when button home is press', () => {
    component.handleNavigateHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
