import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mockUserService = jasmine.createSpyObj('UserService', ['user$']);
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to user$ observable', () => {
      const user = { username: 'test', email: 'test@test.com' };
      mockUserService.user$ = of(user);
      component.ngOnInit();
      expect(component.loggedInUser).toEqual(user as any);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to user$ observable', () => {
      mockUserService.user$ = of(null);
      component.ngOnInit();
      expect(component.loggedInUser).toEqual(null);
    });
  });

  describe('navigation', () => {
    it('should navigate to posts page', () => {
      component.handleNavigateToPost();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['posts']);
    });

    it('should navigate to login page', () => {
      component.handleNavigateToLogIn();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should navigate to register page', () => {
      component.handleNavigateToRegister();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['register']);
    });

    it('should navigate to create page', () => {
      component.handleNavigateToCreate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['create']);
    });

    it('should navigate to favorites list', () => {
      component.handleNavigateToFavorites();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['favorites']);
    });
  });
});
