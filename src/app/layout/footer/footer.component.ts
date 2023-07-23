import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  isPepe = false;
  constructor(private changeDetector: ChangeDetectorRef) {}
  deployPepe() {
    const audio = new Audio();
    audio.src = '/assets/goofyy.mp3';
    audio.load();
    audio.play();
    this.isPepe = true;
    setTimeout(() => {
      this.isPepe = false;
      this.changeDetector.detectChanges();
    }, 33000);
  }
}
