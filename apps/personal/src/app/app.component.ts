import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';

import { DesktopManagerComponent } from '@po/personal/components/desktop-manager';
import { DockComponent } from '@po/personal/components/dock';
import { MenuBarComponent } from '@po/personal/components/menubar';
import { WindowManagerComponent } from '@po/personal/components/window-manager';

@Component({
  selector: 'ps-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    MenuBarComponent,
    DockComponent,
    WindowManagerComponent,
    DesktopManagerComponent,
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
