import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'myApp';

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.getToken();
  }

  getToken() {
    const user = localStorage.getItem('userConnected');
    if (!user) return;
    const userConnected = JSON.parse(user);
    this.service.user$.next(userConnected);
  }
}
