import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/model/post';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updatepost',
  templateUrl: './updatepost.component.html',
  styleUrls: ['./updatepost.component.scss'],
})
export class UpdatepostComponent {
  isLoading: boolean = false;
  update: FormGroup;
  params: string = '';
  post: Post | null = null;
  constructor(
    public formBuilder: FormBuilder,
    public service: PostService,
    private router: Router,
    private zone: NgZone,
    private route: ActivatedRoute
  ) {
    this.update = formBuilder.group({
      description: [''],
      flair: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.params = params.get('id') as string;
    });
    this.service.getPost(this.params).subscribe((post) => {
      this.post = post;
      this.update = this.formBuilder.group({
        description: [post.description],
        flair: [post.flair],
      });
    });
  }

  handleSubmit() {
    this.isLoading = true;
    const userPost = {
      description: this.update.value.description,
      flair: this.update.value.flair,
    };
    this.service
      .updatePost(userPost, this.params)
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'error',
            title: 'eeeeeh pringaaaoooo',
            text: 'Te falta informacion tonto',
          });
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.zone.run(() => this.router.navigate(['posts', this.params]));
        this.isLoading = false;
      });
  }
}
