import { Component } from '@angular/core';
import { MenuItems } from 'src/model/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  buttons: MenuItems[];
  isMenuDeployed = false;
  menuTimeout: number | null = null;
  constructor() {
    this.buttons = [
      { path: '', label: 'home' },
      { path: 'register', label: 'register' },
      { path: 'posts', label: 'post' },
    ];
  }

  deployMenu() {
    this.isMenuDeployed = !this.isMenuDeployed;
    if (this.isMenuDeployed) {
      this.menuTimeout = window.setTimeout(() => {
        this.isMenuDeployed = false;
        this.menuTimeout = null;
      }, 5000);
    }
  }
}
