import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly loadingProgressDuration = 1.5; //1.5s

  ngOnInit() {
    this.hideLoadingScreen();
  }

  private hideLoadingScreen(): void {
    gsap.to('#loading', {
      autoAlpha: 0,
      delay: this.loadingProgressDuration + 0.1,
      duration: 0.6,
    });
  }
}
