import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { TooltipDirective } from '@po/personal/directives/tooltip';
import { AppId } from '@po/personal/enums';
import { WindowManagerService } from '@po/personal/state/window';

import { DockItemComponent } from './components/dock-item/dock-item.component';

@Component({
  selector: 'ps-dock',
  templateUrl: 'dock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    NgOptimizedImage,
    DockItemComponent,
    TooltipDirective,
  ],
})
export class DockComponent {
  protected readonly windowManagerService = inject(WindowManagerService);
  protected readonly AppId = AppId;

  protected readonly minimizedWindows = computed(() =>
    this.windowManagerService.windows().filter((window) => window.minimized),
  );

  protected onRestoreWindow(id: string): void {
    this.windowManagerService.restoreWindow(id);
    this.windowManagerService.focusWindow(id);
  }

  protected onOpenApp(appId: AppId): void {
    this.windowManagerService.openApp(appId);
  }
}
