import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from 'src/app/services/user/user.service';
import { BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/model/user';
import { LoggedUser } from 'src/model/token';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUserService: Partial<UserService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockUserService = {
      user$: new BehaviorSubject<LoggedUser | null>({
        userConnected: {
          token: 'test-token',
          user: {
            id: 'test-id',
            userName: 'test-username',
            email: 'test@email.com',
            passwd: 'test-password',
          },
        },
      }),
      logoutUser: jasmine.createSpy('logoutUser'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProfileComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should deploy menu when clicked', () => {
    expect(component.isMenuDeployed).toBeFalse();
    component.deployMenu();
    expect(component.isMenuDeployed).toBeTrue();
  });

  it('should log out when clicked', () => {
    component.handleLogout();
    expect(mockUserService.logoutUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should navigate to favorites when goToFavorites is called', () => {
    component.goToFavorites();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['favorites']);
  });

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should navigate to create a Post when goToCreatePost is called', () => {
    component.goToCreatePost();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['create']);
  });

  it('Menu should auto close after 3 seconds', fakeAsync(() => {
    component.deployMenu();
    expect(component.isMenuDeployed).toBeTrue();
    tick(5100);
    expect(component.isMenuDeployed).toBeFalse();
  }));
});
