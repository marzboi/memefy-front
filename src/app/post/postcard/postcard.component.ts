import { Component, Inject, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/model/post';
import { faPencil, faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoggedUser } from 'src/model/token';
import { UserService } from 'src/app/services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-postcard',
  templateUrl: './postcard.component.html',
  styleUrls: ['./postcard.component.scss'],
})
export class PostcardComponent {
  socket: Socket;
  isLoading: boolean = true;
  comment: FormGroup;
  faHeart = faHeart;
  faTrash = faTrash;
  faPencil = faPencil;
  post: Post | null = null;
  params: Params = { id: '' };
  loggedInUser: LoggedUser | null = null;
  constructor(
    public formBuilder: FormBuilder,
    public service: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private socketService: SocketService
  ) {
    this.comment = formBuilder.group({
      comment: ['', [Validators.required]],
    });
    this.socket = this.socketService.getSocket();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.params = params;
      this.loadPost();
    });
    this.userService.user$.subscribe((user) => {
      user ? (this.loggedInUser = user) : (this.loggedInUser = null);
    });
    this.socket.on('postDeleted', () => {
      this.zone.run(() => this.router.navigate(['posts']));
    });
    this.socket.on('updatePost', () => {
      this.service.getPost(this.params['id']).subscribe((post) => {
        this.post = post;
      });
    });
  }

  ngOnDestroy(): void {
    this.socket.off('postDeleted');
    this.socket.off('updatePost');
  }

  loadPost() {
    this.service
      .getPost(this.params['id'])
      .pipe(
        catchError(() => {
          this.router.navigate(['error']);
          return EMPTY;
        })
      )
      .subscribe((post) => {
        this.post = post;
        this.isLoading = false;
      });
  }

  deletePost() {
    this.service
      .deletePost(this.params['id'])
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'warning',
            title: 'OOPS!',
            text: 'Try again in a couple seconds',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.post = null;
        this.zone.run(() => this.router.navigate(['posts']));
      });
  }

  handleEditPost() {
    this.zone.run(() => this.router.navigate(['post', this.params['id']]));
  }

  handleReturntoPosts() {
    this.zone.run(() => this.router.navigate(['posts']));
  }

  handleAddToFavorites() {
    if (!this.post) return;
    this.service
      .addToFavorites(this.post, this.params['id'])
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'error',
            title: 'Try again',
            toast: true,
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Post added to favorites',
          text: 'Another one to the collection',
          toast: true,
        });
        return EMPTY;
      });
  }

  handleAddComment() {
    if (!this.comment.valid) return;

    const comment = {
      comment: this.comment.value.comment,
    };

    this.service
      .addComment(comment, this.params['id'])
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'error',
            title: 'Try again',
            toast: true,
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'comment successfully added',
          toast: true,
          timer: 2000,
          showConfirmButton: false,
        });
        this.service.getPost(this.params['id']).subscribe((post) => {
          this.post = post;
        });
        this.comment.reset();
      });
  }
}
