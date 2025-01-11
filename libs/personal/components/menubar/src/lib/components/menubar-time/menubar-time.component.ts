import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IS_TEST } from '@po/shared/testing';
import { interval } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ps-menubar-time',
  templateUrl: 'menubar-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
})
export class MenuBarTimeComponent {
  protected readonly now = computed(() => this._now());
  protected readonly showColons = computed(() => this._showColons());

  private readonly isTest = inject(IS_TEST, { optional: true });

  private readonly _now = signal(new Date());
  private readonly _showColons = signal(true);

  constructor() {
    if (!this.isTest) {
      this.initCounter();
    }
  }

  private initCounter(): void {
    effect(() => {
      interval(1_000)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this._now.set(new Date());
            this._showColons.set(!this._showColons());
          },
        });
    });
  }
}
