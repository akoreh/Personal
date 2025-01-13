import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-dock',
  templateUrl: 'dock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class DockComponent {
  protected readonly windowManagerService = inject(WindowManagerService);
}
