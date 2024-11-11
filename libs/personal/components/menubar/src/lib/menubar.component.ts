import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuBarTimeComponent } from './components/menubar-time/menubar-time.component';

@Component({
  standalone: true,
  selector: 'ps-menubar',
  templateUrl: 'menubar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuBarTimeComponent],
})
export class MenuBarComponent {}
