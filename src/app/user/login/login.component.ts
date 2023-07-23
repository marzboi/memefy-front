import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { Socket } from 'socket.io-client';
import { UserService } from 'src/app/services/user/user.service';
import { LoggedUser } from 'src/model/token';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading: boolean = false;
  login: FormGroup;
  errorMessage: string = '';
  loggedInUser: LoggedUser | null = null;
  constructor(
    public formBuilder: FormBuilder,
    private service: UserService,
    private router: Router,
    private zone: NgZone
  ) {
    this.login = formBuilder.group({
      user: ['', [Validators.required]],
      passwd: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.service.user$.subscribe((user) => {
      user ? (this.loggedInUser = user) : (this.loggedInUser = null);
    });
  }

  handleSubmit() {
    this.isLoading = true;
    const userLogin = {
      user: this.login.value.user,
      passwd: this.login.value.passwd,
    };

    this.service
      .loginUser(userLogin)
      .pipe(
        catchError(() => {
          this.errorMessage = 'Error, try again';
          Swal.fire({
            icon: 'error',
            title: 'Wrong credentials',
            text: 'What you need chatGPT to do that for you too?',
            toast: true,
          });
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.zone.run(() => this.router.navigate(['']));
        Swal.fire({
          icon: 'success',
          toast: true,
          title: 'Welcome!',
          text: 'Enjoy the time in!',
          timer: 2000,
          showConfirmButton: false,
        });
        this.isLoading = false;
      });
  }

  handleLogout() {
    this.service.logoutUser();
  }
}
