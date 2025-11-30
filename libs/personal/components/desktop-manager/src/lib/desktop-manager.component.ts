import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppId } from '@po/personal/enums';
import { WindowManagerService } from '@po/personal/state/window';

import { DesktopIconComponent } from './components/desktop-icon/desktop-icon.component';

@Component({
  selector: 'ps-desktop-manager',
  templateUrl: './desktop-manager.component.html',
  styleUrl: 'desktop-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesktopIconComponent],
})
export class DesktopManagerComponent {
  private readonly windowManagerService = inject(WindowManagerService);

  protected onOpenResumeApp(): void {
    this.windowManagerService.openApp(AppId.Resume);
  }
}
