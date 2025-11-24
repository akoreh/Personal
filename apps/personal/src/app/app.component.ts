import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';

import { DockComponent } from '@po/personal/components/dock';
import { MenuBarComponent } from '@po/personal/components/menubar';
import { WindowManagerComponent } from '@po/personal/components/window-manager';
import { AuthStateModule } from '@po/personal/state/auth';

@Component({
  selector: 'ps-root',
  templateUrl: './app.component.html',
  imports: [
    AuthStateModule,
    MenuBarComponent,
    DockComponent,
    WindowManagerComponent,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  protected readonly isDev = true;
  protected readonly boundary =
    viewChild.required<ElementRef<HTMLElement>>('desktopArea');

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
