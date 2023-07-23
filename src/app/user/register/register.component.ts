import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  register: FormGroup;
  avatar: File | null = null;
  isLoading: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public service: UserService,
    private router: Router,
    private zone: NgZone
  ) {
    this.register = formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      passwd: ['', [Validators.required]],
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.avatar = files.item(0);
  }

  handleSubmit() {
    this.isLoading = true;
    const userRegister: FormData = new FormData();
    userRegister.append('userName', this.register.value.userName);
    userRegister.append('email', this.register.value.email);
    userRegister.append('passwd', this.register.value.passwd);
    if (this.avatar) {
      userRegister.append('avatar', this.avatar, this.avatar.name);
    }

    this.service
      .registerUser(userRegister)
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'error',
            title: 'Try Again!',
            text: 'Password must be at least 8 characters long and capital letter, also a valid avatar!',
            toast: true,
          });
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.zone.run(() => this.router.navigate(['login']));
        Swal.fire({
          icon: 'success',
          toast: true,
          text: 'You are ready to log In',
          timer: 2000,
          showConfirmButton: false,
        });
        this.isLoading = false;
      });
  }
}
