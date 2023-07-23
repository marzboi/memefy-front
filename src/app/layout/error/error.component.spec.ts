import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: NgZone, useValue: new NgZone({}) },
      ],
    });
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on handleNavigateToHome', () => {
    component.handleNavigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
