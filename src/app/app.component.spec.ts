import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { UserService } from './services/user/user.service';
import { HttpClientModule } from '@angular/common/http';
import { PostModule } from './post/post.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

describe('AppComponent', () => {
  let userService: UserService;
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockUserService = {
    user$: {
      next: jasmine.createSpy('next'),
    },
    getToken: jasmine.createSpy('getToken').and.callFake((token) => {
      return of(token);
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        AppRoutingModule,
        LayoutModule,
        UserModule,
        HomeModule,
        PostModule,
        HttpClientModule,
      ],
      declarations: [AppComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  describe('When ngOnInit is called', () => {
    it('Should call getToken', () => {
      const getInitialToken = spyOn(app, 'getToken').and.callThrough();
      app.ngOnInit();
      expect(getInitialToken).toHaveBeenCalled();
    });
  });

  describe('When getToken is called and there is already a token', () => {
    it('Should call next with the userInfo', () => {
      const mockUserInfo = {
        userConnected: {
          token: 'abc123',
          user: { userName: 'Josebota', passwd: 'Amongus' },
        },
      };
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify(mockUserInfo)
      );
      app.getToken();
      expect(userService.user$.next).toHaveBeenCalledWith(mockUserInfo);
    });
  });

  describe('When getToken is called and there is already a token', () => {
    it('Should call next with the userInfo', () => {
      const mockUserInfo = {
        userConnected: {
          token: 'abc123',
          user: { userName: 'Sergio', passwd: 'TailwindCss' },
        },
      };
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify(mockUserInfo)
      );
      app.getToken();
      expect(userService.user$.next).toHaveBeenCalledWith(mockUserInfo);
    });
  });

  describe('When getToken is called and there is no token', () => {
    it('Should not call next', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      app.getToken();
      expect(userService.user$.next).toHaveBeenCalled();
    });
  });
});
