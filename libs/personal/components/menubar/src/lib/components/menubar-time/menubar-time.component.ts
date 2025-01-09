import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MenuBarTimeStore } from './menubar-time.component.store';

@Component({
  selector: 'ps-menubar-time',
  templateUrl: 'menubar-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DatePipe],
  providers: [MenuBarTimeStore],
})
export class MenuBarTimeComponent {
  protected readonly store = inject(MenuBarTimeStore);
}
