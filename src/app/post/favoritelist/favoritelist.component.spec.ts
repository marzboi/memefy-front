import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritelistComponent } from './favoritelist.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/model/post';

describe('FavoritelistComponent', () => {
  let component: FavoritelistComponent;
  let fixture: ComponentFixture<FavoritelistComponent>;
  let mockPostService: Partial<PostService>;
  let mockUserService: Partial<UserService>;
  let mockPost: Post;

  beforeEach(() => {
    mockUserService = {
      loadUserFavorites: jasmine
        .createSpy('loadUserFavorites')
        .and.returnValue(of([])),
    };

    mockPostService = {
      removeFromFavorites: jasmine
        .createSpy('removeFromFavorites')
        .and.returnValue(of(null)),
    };

    mockPost = {
      id: '1',
      description: 'test',
      image: { url: 'test.jpg' },
      owner: { userName: 'marquito', avatar: { url: 'text.jpg' } },
      flair: 'test',
    } as Post;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FavoritelistComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: PostService, useValue: mockPostService },
      ],
    });
    fixture = TestBed.createComponent(FavoritelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a favorite post', () => {
    component.handleRemoveFavorite(mockPost, 'id');
    expect(mockPostService.removeFromFavorites).toHaveBeenCalledWith(
      mockPost,
      'id'
    );
    expect(mockUserService.loadUserFavorites).toHaveBeenCalled();
  });
});
