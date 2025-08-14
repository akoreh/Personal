import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { AuthStore } from '@po/personal/state/auth';
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
}
