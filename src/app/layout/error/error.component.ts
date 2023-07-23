import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(private zone: NgZone, private router: Router) {}

  handleNavigateToHome() {
    this.zone.run(() => this.router.navigate(['']));
  }
}
