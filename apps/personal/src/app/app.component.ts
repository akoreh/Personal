import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowManagerComponent } from '@personal/personal-components-window-manager';
import { gsap } from 'gsap';

import { DockComponent } from '@po/personal/components/dock';
import { MenuBarComponent } from '@po/personal/components/menubar';

@Component({
  selector: 'ps-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    MenuBarComponent,
    DockComponent,
    WindowManagerComponent,
  ],
})
export class AppComponent implements OnInit {
  protected readonly isDev = true;

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
