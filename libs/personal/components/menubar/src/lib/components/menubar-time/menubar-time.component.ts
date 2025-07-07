import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
  protected readonly now = signal(new Date());
  protected readonly showColons = signal(true);

  private readonly isTest = inject(IS_TEST, { optional: true });

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
            this.now.set(new Date());
            this.showColons.set(!this.showColons());
          },
        });
    });
  }
}
