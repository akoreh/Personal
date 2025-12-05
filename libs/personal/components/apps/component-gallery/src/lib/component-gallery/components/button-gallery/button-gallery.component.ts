import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, startWith, switchMap, timer } from 'rxjs';

import { ButtonComponent } from '@po/personal/components/button';

@Component({
  selector: 'ps-button-gallery',
  templateUrl: './button-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
})
export class ButtonGalleryComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly variants = [
    'primary',
    'secondary',
    'danger',
    'warning',
    'success',
    'info',
  ] as const;
  readonly sizes = ['sm', 'md', 'lg'] as const;
  readonly autoToggleVariants = ['primary', 'secondary', 'danger'] as const;
  readonly manualToggleVariants = ['warning', 'success', 'info'] as const;

  readonly loadingStates = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    this.autoToggleVariants.forEach((variant) =>
      this.startLoadingCycle(variant),
    );
  }

  toggleLoading(variant: string): void {
    if (this.loadingStates()[variant]) return;

    this.loadingStates.update((s) => ({ ...s, [variant]: true }));

    const duration = Math.random() * 2000 + 1000;
    setTimeout(() => {
      this.loadingStates.update((s) => ({ ...s, [variant]: false }));
    }, duration);
  }

  private startLoadingCycle(variant: string): void {
    const randomInterval = () => Math.random() * 3000 + 1500;

    interval(randomInterval())
      .pipe(
        startWith(0),
        switchMap(() => {
          this.loadingStates.update((s) => ({ ...s, [variant]: true }));
          return timer(randomInterval());
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.loadingStates.update((s) => ({ ...s, [variant]: false }));
      });
  }
}
