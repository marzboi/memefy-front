import { Component, NgZone } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/model/post';
import {
  faFaceLaughWink,
  faFaceAngry,
  faBong,
} from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.scss'],
})
export class PostlistComponent {
  socket: Socket;
  isLoading: boolean = true;
  postArray: Post[] | null = null;
  nextUrl: string | null = null;
  previusUrl: string | null = null;
  faFaceAwesome = faFaceLaughWink;
  faFaceAngry = faFaceAngry;
  faBong = faBong;
  constructor(
    public service: PostService,
    private socketService: SocketService,
    private router: Router,
    private zone: NgZone
  ) {
    this.socket = this.socketService.getSocket();
  }
  ngOnInit(): void {
    this.LoadAllPost();

    ['updatePost', 'postDeleted', 'postCreated'].forEach((event) => {
      this.socket.on(event, this.notification);
    });
  }

  ngOnDestroy(): void {
    this.socket.off('postCreated');
    this.socket.off('updatePost');
  }

  handleLoadNextOrPrevious(url: string) {
    this.isLoading = true;
    this.service.getAllPosts(url).subscribe((posts) => {
      this.postArray = posts;
      this.nextUrl = this.service.next$.value;
      this.previusUrl = this.service.previous$.value;
      this.isLoading = false;
    });
  }

  handleLoadFlair(x: string) {
    this.isLoading = true;
    this.service.getAllPosts(this.service.postUrl, x).subscribe((posts) => {
      this.postArray = posts;
      this.nextUrl = this.service.next$.value;
      this.previusUrl = this.service.previous$.value;
      this.isLoading = false;
    });
  }

  LoadAllPost() {
    this.isLoading = true;
    this.service
      .getAllPosts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((posts) => {
        if (posts.length === 0) return;
        this.postArray = posts;
        this.nextUrl = this.service.next$.value;
        this.previusUrl = this.service.previous$.value;
      });
  }

  notification() {
    Swal.fire({
      title: 'There is a new update!',
      text: 'refresh if you want to see it',
      toast: true,
      timer: 3000,
      showConfirmButton: false,
      position: 'top-end',
    });
  }

  handleNavigateHome() {
    this.zone.run(() => this.router.navigate(['']));
  }
}
