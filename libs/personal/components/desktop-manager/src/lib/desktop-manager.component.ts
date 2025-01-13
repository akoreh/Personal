import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppShellComponent } from '@po/personal/components/app-shell';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-desktop-manager',
  templateUrl: './desktop-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShellComponent],
})
export class DesktopManagerComponent {
  private readonly windowManager = inject(WindowManagerService);

  onOpenReelDownloader(): void {}
}
