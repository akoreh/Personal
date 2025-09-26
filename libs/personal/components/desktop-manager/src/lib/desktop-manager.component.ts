import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-desktop-manager',
  templateUrl: './desktop-manager.component.html',
  styleUrl: 'desktop-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopManagerComponent {
  private readonly windowManager = inject(WindowManagerService);

  protected readonly folders = [1];
}
