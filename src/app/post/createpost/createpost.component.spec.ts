import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostService } from 'src/app/services/post/post.service';
import { CreatepostComponent } from './createpost.component';
import { Post } from 'src/model/post';

class PostServiceMock {
  createPost(postData: FormData) {
    return of(postData);
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('CreatepostComponent', () => {
  let component: CreatepostComponent;
  let fixture: ComponentFixture<CreatepostComponent>;
  let postService: PostService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatepostComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PostService, useClass: PostServiceMock },
        { provide: Router, useClass: MockRouter },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(CreatepostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.create.value).toEqual({ description: '', flair: '' });
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
    expect(component.image).toEqual(file);
  });

  it('should navigate to posts when handleSubmit is called and service call is successful', () => {
    spyOn(postService, 'createPost').and.returnValue(of({} as Post));
    component.handleSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['posts/undefined']);
  });

  it('should not navigate when handleSubmit is called and service call fails', () => {
    spyOn(postService, 'createPost').and.returnValue(throwError('Error'));
    component.handleSubmit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should append image to FormData when handleSubmit is called and image is not null', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const formDataMock = jasmine.createSpyObj(['append']);
    spyOn(window, 'FormData').and.returnValue(formDataMock as any);
    component.image = file;

    spyOn(postService, 'createPost').and.returnValue(of({} as Post));
    component.handleSubmit();

    expect(formDataMock.append).toHaveBeenCalledWith('image', file, file.name);
  });
});
