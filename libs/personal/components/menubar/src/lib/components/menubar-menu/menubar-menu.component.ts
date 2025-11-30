import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { AppId } from '@po/personal/enums';
import { AuthStore } from '@po/personal/state/auth';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-menubar-menu',
  templateUrl: 'menubar-menu.component.html',
  styleUrl: 'menubar-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, CdkOverlayOrigin, CdkConnectedOverlay],
})
export class MenuBarMenuComponent {
  static nextId = 0;

  protected readonly id = `ps-menubar-menu-${MenuBarMenuComponent.nextId++}`;

  private readonly authStore = inject(AuthStore);
  protected readonly windowManagerService = inject(WindowManagerService);

  protected readonly isOpen = signal(false);
  protected readonly isAuthenticated = computed(() =>
    this.authStore.isAuthenticated(),
  );

  protected toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isOpen.set(false);
  }

  protected handleAction(): void {
    if (this.isAuthenticated()) {
      this.authStore.logout();
    } else {
      this.windowManagerService.openApp(AppId.Auth);
    }
    this.closeMenu();
  }
}
