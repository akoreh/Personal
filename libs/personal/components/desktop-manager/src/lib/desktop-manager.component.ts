import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppShellComponent } from '@po/personal/components/app-shell';
import { ResumeAppComponent } from '@po/personal/components/apps/resume-app';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-desktop-manager',
  templateUrl: './desktop-manager.component.html',
  styleUrl: 'desktop-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShellComponent],
})
export class DesktopManagerComponent {
  private readonly windowManagerService = inject(WindowManagerService);

  onOpenResumeApp(): void {
    this.windowManagerService.openWindow(ResumeAppComponent);
  }
}
