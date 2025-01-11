import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';

import { DockComponent } from '@po/personal/components/dock';
import { MenuBarComponent } from '@po/personal/components/menubar';
import { WindowComponent } from '@po/personal/components/window';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    MenuBarComponent,
    DockComponent,
    WindowComponent,
    NgTemplateOutlet,
  ],
})
export class AppComponent implements OnInit {
  protected readonly windowManagerService = inject(WindowManagerService);

  protected readonly isDev = true;

  readonly underMaintenanceTemplate = viewChild<TemplateRef<any>>(
    'underMaintenanceContent',
  );

  private readonly loadingProgressDuration = this.isDev ? 0 : 1.5; //1.5s

  private readonly viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    this.hideLoadingScreen();

    const template = this.underMaintenanceTemplate();

    if (this.isDev && template) {
      this.windowManagerService.openWindow(template, {
        title: 'Maintenance',
        maximizable: false,
        minimizable: false,
        closable: true,
      });
    }
  }

  private hideLoadingScreen(): void {
    gsap.to('#loading', {
      autoAlpha: 0,
      delay: this.loadingProgressDuration + (this.isDev ? 0 : 0.1),
      duration: this.isDev ? 0 : 0.6,
    });
  }
}
