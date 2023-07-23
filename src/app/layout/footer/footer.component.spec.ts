import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { ChangeDetectorRef } from '@angular/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } },
      ],
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isPepe to true and then false after 33 seconds when deployPepe is called', fakeAsync(() => {
    spyOn(window as any, 'Audio').and.returnValue({
      src: '',
      load: () => {},
      play: () => new Promise<void>((resolve, reject) => resolve()),
    });

    component.deployPepe();

    expect(component.isPepe).toBeTrue();

    tick(33000);

    expect(component.isPepe).toBeFalse();
  }));
});
