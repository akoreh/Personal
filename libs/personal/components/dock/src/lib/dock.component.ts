import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { WindowManagerService } from '@po/personal/state/window';

import { dockItems } from './const/dock-items.const';

@Component({
  selector: 'ps-dock',
  templateUrl: 'dock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, NgOptimizedImage],
})
export class DockComponent {
  protected readonly windowManagerService = inject(WindowManagerService);

  protected readonly dockItems = dockItems;

  protected readonly minimizedWindows = computed(() =>
    this.windowManagerService.windows().filter((window) => window.minimized),
  );

  protected onRestoreWindow(id: string): void {
    this.windowManagerService.restoreWindow(id);
    this.windowManagerService.focusWindow(id);
  }
}
