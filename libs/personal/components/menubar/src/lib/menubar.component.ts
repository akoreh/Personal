import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { AuthStore } from '@po/personal/state/auth';

import { MenuBarIconsComponent } from './components/menubar-icons/menubar-icons.component';
import { MenuBarTimeComponent } from './components/menubar-time/menubar-time.component';

@Component({
  selector: 'ps-menubar',
  templateUrl: 'menubar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuBarTimeComponent, MenuBarIconsComponent],
})
export class MenuBarComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly username = computed(() =>
    this.authStore.isAuthenticated()
      ? (this.authStore.username() as string)
      : 'Guest',
  );
}
