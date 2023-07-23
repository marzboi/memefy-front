import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { LoggedUser } from 'src/model/token';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  isMenuDeployed = false;
  loggedInUser: LoggedUser | null = null;
  menuTimeout: number | null = null;
  constructor(
    private service: UserService,
    private router: Router,
    private zone: NgZone
  ) {}

  deployMenu() {
    this.isMenuDeployed = !this.isMenuDeployed;
    if (this.isMenuDeployed) {
      this.menuTimeout = window.setTimeout(() => {
        this.isMenuDeployed = false;
        this.menuTimeout = null;
      }, 5000);
    }
  }

  ngOnInit(): void {
    this.service.user$.subscribe((user) => {
      user ? (this.loggedInUser = user) : (this.loggedInUser = null);
    });
  }

  handleLogout() {
    this.service.logoutUser();
    this.zone.run(() => this.router.navigate(['login']));
  }

  goToFavorites() {
    this.zone.run(() => this.router.navigate(['favorites']));
  }

  goToLogin() {
    this.zone.run(() => this.router.navigate(['login']));
  }

  goToCreatePost() {
    this.zone.run(() => this.router.navigate(['create']));
  }
}
