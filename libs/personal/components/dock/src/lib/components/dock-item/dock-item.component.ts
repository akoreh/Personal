import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-dock-item',
  templateUrl: './dock-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockItemComponent {}
