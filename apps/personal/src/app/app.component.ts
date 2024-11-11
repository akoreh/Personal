import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';

import { MenuBarComponent } from '@po/personal/components/menubar';

@Component({
  standalone: true,
  selector: 'ps-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, MenuBarComponent],
})
export class AppComponent implements OnInit {
  private readonly isDev = true;

  private readonly loadingProgressDuration = this.isDev ? 0 : 1.5; //1.5s

  ngOnInit() {
    this.hideLoadingScreen();
  }

  private hideLoadingScreen(): void {
    gsap.to('#loading', {
      autoAlpha: 0,
      delay: this.loadingProgressDuration + (this.isDev ? 0 : 0.1),
      duration: this.isDev ? 0 : 0.6,
    });
  }
}
