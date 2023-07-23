import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoggedUser } from 'src/model/token';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: Partial<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    let loggedUser: LoggedUser = {
      userConnected: { token: '123token', user: { userName: 'hello' } },
    };

    let user$ = new BehaviorSubject<LoggedUser | null>(loggedUser);

    mockUserService = jasmine.createSpyObj<UserService>([
      'loginUser',
      'logoutUser',
      'user$',
    ]);

    mockUserService.user$ = user$;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle login on submit', () => {
    const userLogin = { user: 'user', passwd: 'password' };
    component.login.setValue(userLogin);

    mockUserService.loginUser.and.returnValue(of({}) as any);
    spyOn(Swal, 'fire');

    component.handleSubmit();

    expect(mockUserService.loginUser).toHaveBeenCalledWith(userLogin);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should handle error on submit', () => {
    const userLogin = { user: 'user', passwd: 'password' };
    component.login.setValue(userLogin);

    mockUserService.loginUser.and.returnValue(throwError('error'));
    spyOn(Swal, 'fire');

    component.handleSubmit();

    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should handle logout', () => {
    component.handleLogout();
    expect(mockUserService.logoutUser).toHaveBeenCalled();
  });

  it('should set user to null on init', () => {
    let loggedUser = null;

    let user$ = new BehaviorSubject<LoggedUser | null>(loggedUser);

    mockUserService.user$ = user$;

    component.ngOnInit();

    expect(component.loggedInUser).toBe(null);
  });
});
