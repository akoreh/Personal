import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';

@Component({
  standalone: true,
  selector: 'ps-menubar-icons',
  templateUrl: 'menubar-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class MenuBarIconsComponent {}