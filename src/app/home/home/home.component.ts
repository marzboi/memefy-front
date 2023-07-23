import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { LoggedUser } from 'src/model/token';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loggedInUser: LoggedUser | null = null;
  constructor(
    private service: UserService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.service.user$.subscribe((user) => {
      user ? (this.loggedInUser = user) : (this.loggedInUser = null);
    });
  }

  handleNavigateToPost() {
    this.zone.run(() => this.router.navigate(['posts']));
  }

  handleNavigateToLogIn() {
    this.zone.run(() => this.router.navigate(['login']));
  }

  handleNavigateToRegister() {
    this.zone.run(() => this.router.navigate(['register']));
  }

  handleNavigateToCreate() {
    this.zone.run(() => this.router.navigate(['create']));
  }

  handleNavigateToFavorites() {
    this.zone.run(() => this.router.navigate(['favorites']));
  }
}
