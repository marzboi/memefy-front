import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MenuComponent],
    });
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('When the menu is deployed, then isMenuDeployed should be true', () => {
    component.deployMenu();
    expect(component.isMenuDeployed).toBeTrue();
  });

  it('Menu should auto close after 3 seconds', fakeAsync(() => {
    component.deployMenu();
    expect(component.isMenuDeployed).toBeTrue();
    tick(5100);
    expect(component.isMenuDeployed).toBeFalse();
  }));
});
