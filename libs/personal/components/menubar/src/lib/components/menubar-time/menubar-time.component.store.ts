import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { IS_TEST } from '@po/shared/testing';
import { filter, interval, of, switchMap, tap } from 'rxjs';

interface MenuBarTimeState {
  now: Date;
  showColons: boolean;
}

const initialState: MenuBarTimeState = {
  now: new Date(),
  showColons: true,
};

@Injectable()
export class MenuBarTimeStore extends ComponentStore<MenuBarTimeState> {
  private readonly isTest = inject(IS_TEST, { optional: true });

  // Selectors
  readonly now$ = this.select(({ now }) => now);
  readonly showColons$ = this.select(({ showColons }) => showColons);

  // Updaters
  private readonly updateTime = this.updater((state) => ({
    now: new Date(),
    showColons: !state.showColons,
  }));

  // Effects
  readonly interval$ = this.effect(() =>
    of(true).pipe(
      // TODO: Find a better solution
      filter(() => !this.isTest),
      switchMap(() => interval(1_000)),
      tap(() => this.updateTime()),
    ),
  );

  constructor() {
    super(initialState);
  }
}
