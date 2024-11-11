import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IS_TEST } from '@po/shared/testing';
import { interval } from 'rxjs';

import { MenuBarTimeStore } from './menubar-time.component.store';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'ps-menubar-time',
  templateUrl: 'menubar-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DatePipe],
  providers: [MenuBarTimeStore],
})
export class MenuBarTimeComponent {
  protected readonly store = inject(MenuBarTimeStore);
}
