import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuBarIconsComponent } from './components/menubar-icons/menubar-icons.component';
import { MenuBarTimeComponent } from './components/menubar-time/menubar-time.component';

@Component({
  selector: 'ps-menubar',
  templateUrl: 'menubar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuBarTimeComponent, MenuBarIconsComponent],
})
export class MenuBarComponent {}
