import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRouter: Partial<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj<UserService>(['registerUser']);
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ],
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error on submit', () => {
    const userRegister = {
      userName: 'user',
      email: 'email@example.com',
      passwd: 'password',
    };
    component.register.setValue(userRegister);

    mockUserService.registerUser.and.returnValue(throwError('error'));
    spyOn(Swal, 'fire');

    component.handleSubmit();

    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should update the image when onFileChange is called', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const mockFileList: {
      [index: number]: File;
      length: number;
      item: (index: number) => File | null;
    } = {
      0: file,
      length: 1,
      item: (index: number): File | null => mockFileList[index] || null,
    };

    const event = { target: { files: mockFileList } } as any;
    component.onFileChange(event);
    expect(component.avatar).toEqual(file);
  });

  it('should handle registration on submit', () => {
    const userRegister = {
      userName: 'user',
      email: 'email@example.com',
      passwd: 'password',
    };
    component.register.setValue(userRegister);
    mockUserService.registerUser.and.returnValue(of(userRegister) as any);

    component.handleSubmit();

    expect(mockUserService.registerUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should append image to FormData when handleSubmit is called and image is not null', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const formDataMock = jasmine.createSpyObj(['append']);
    spyOn(window, 'FormData').and.returnValue(formDataMock as any);
    component.avatar = file;

    mockUserService.registerUser.and.returnValue(of());

    component.handleSubmit();

    expect(formDataMock.append).toHaveBeenCalledWith('avatar', file, file.name);
  });
});
