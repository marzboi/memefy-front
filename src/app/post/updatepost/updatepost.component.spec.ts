import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepostComponent } from './updatepost.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Post } from 'src/model/post';

describe('UpdatepostComponent', () => {
  let component: UpdatepostComponent;
  let fixture: ComponentFixture<UpdatepostComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  let fakeParamMap = new BehaviorSubject({ get: (key: string) => '1' });

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: fakeParamMap.asObservable() },
        },
      ],
      declarations: [UpdatepostComponent],
    });
    fixture = TestBed.createComponent(UpdatepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post details on init', () => {
    const mockPost = {
      description: 'mock description',
      flair: 'mock flair',
    } as Post;
    spyOn(component.service, 'getPost').and.returnValue(of(mockPost));
    component.ngOnInit();
    expect(component.params).toBe('1');
    expect(component.post).toEqual(mockPost);
    expect(component.update.value).toEqual({
      description: mockPost.description,
      flair: mockPost.flair,
    });
  });

  it('should update the post and navigate to posts page on submit', () => {
    const postUpdate = {
      description: 'updated description',
      flair: 'updated flair',
    };

    component.update.setValue(postUpdate);
    spyOn(component.service, 'updatePost').and.returnValue(
      of({ description: 'updated description', flair: 'updated flair' } as Post)
    );

    component.handleSubmit();

    expect(component.service.updatePost).toHaveBeenCalledWith(postUpdate, '1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts', '1']);
  });

  it('should handle error on submit', () => {
    const postUpdate = {
      description: 'updated description',
      flair: 'updated flair',
    };
    component.update.setValue(postUpdate);

    spyOn(component.service, 'updatePost').and.returnValue(throwError('error'));
    spyOn(Swal, 'fire');

    component.handleSubmit();

    expect(Swal.fire).toHaveBeenCalled();
  });
});
