import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { PostService } from 'src/app/services/post/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.scss'],
})
export class CreatepostComponent {
  isLoading: boolean = false;
  create: FormGroup;
  image: File | null = null;
  constructor(
    public formBuilder: FormBuilder,
    public service: PostService,
    private router: Router,
    private zone: NgZone
  ) {
    this.create = formBuilder.group({
      description: ['', [Validators.required]],
      flair: ['', [Validators.required]],
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.image = files.item(0);
  }

  handleSubmit() {
    this.isLoading = true;
    const userPost: FormData = new FormData();
    userPost.append('description', this.create.value.description);
    userPost.append('flair', this.create.value.flair);
    if (this.image) {
      userPost.append('image', this.image, this.image.name);
    }

    this.service
      .createPost(userPost)
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            text: 'Try again and check the information',
            toast: true,
          });
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe((post) => {
        this.zone.run(() => this.router.navigate([`posts/${post.id}`]));
        this.isLoading = false;
      });
  }
}
