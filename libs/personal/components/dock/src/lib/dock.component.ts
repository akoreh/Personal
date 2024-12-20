import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';

@Component({
  standalone: true,
  selector: 'ps-dock',
  templateUrl: 'dock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class DockComponent {}
