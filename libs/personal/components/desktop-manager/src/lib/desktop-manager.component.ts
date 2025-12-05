import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppId } from '@po/personal/enums';
import {
  AppRegistryService,
  WindowManagerService,
} from '@po/personal/state/window';

import { DesktopIconComponent } from './components/desktop-icon/desktop-icon.component';

@Component({
  selector: 'ps-desktop-manager',
  templateUrl: './desktop-manager.component.html',
  styleUrl: 'desktop-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesktopIconComponent],
})
export class DesktopManagerComponent {
  protected readonly AppId = AppId;

  protected readonly windowManager = inject(WindowManagerService);

  private readonly appRegistry = inject(AppRegistryService);

  protected readonly resumeApp = this.appRegistry.getApp(AppId.Resume);
  protected readonly jsEngineApp = this.appRegistry.getApp(AppId.JsEngine);
}
