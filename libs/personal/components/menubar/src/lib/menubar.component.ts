import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';

import { MenuBarTimeComponent } from './components/menubar-time/menubar-time.component';

@Component({
  standalone: true,
  selector: 'ps-menubar',
  templateUrl: 'menubar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuBarTimeComponent, IconComponent],
})
export class MenuBarComponent {}
