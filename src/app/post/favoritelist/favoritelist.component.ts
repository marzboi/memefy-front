import { Component, NgZone } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { UserService } from 'src/app/services/user/user.service';
import { Post } from 'src/model/post';

@Component({
  selector: 'app-favoritelist',
  templateUrl: './favoritelist.component.html',
  styleUrls: ['./favoritelist.component.scss'],
})
export class FavoritelistComponent {
  favoritePosts: Post[] | null = null;
  isLoading: boolean = true;
  constructor(public service: UserService, public postService: PostService) {}

  ngOnInit(): void {
    this.service.loadUserFavorites().subscribe((favorites) => {
      this.favoritePosts = favorites;
      this.isLoading = false;
    });
  }

  handleRemoveFavorite(post: Post, id: string) {
    this.postService.removeFromFavorites(post, id).subscribe(() => {
      this.service.loadUserFavorites().subscribe((favorites) => {
        this.favoritePosts = favorites;
      });
    });
  }
}
