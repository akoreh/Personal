import { OverlayContainer } from '@angular/cdk/overlay';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import { IconTestingModule } from '@po/personal/components/icon/testing';
import { AuthStore } from '@po/personal/state/auth';

import { MenuBarMenuComponent } from './menubar-menu.component';
import { MenuBarMenuHarness } from './menubar-menu.component.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-menubar-menu />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

const mockAuthStore = {
  isAuthenticated: signal(false),
  email: signal(null as string | null),
  userId: signal(null as string | null),
  accessToken: signal(null as string | null),
  refreshToken: signal(null as string | null),
  logout: jest.fn(),
};

describe('MenuBarMenuComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: MenuBarMenuHarness;
  let overlayContainer: OverlayContainer;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [MenuBarMenuComponent, TestingModule, IconTestingModule],
    providers: [{ provide: AuthStore, useValue: mockAuthStore }],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(MenuBarMenuHarness);
    overlayContainer = spectator.inject(OverlayContainer);
  });

  afterEach(() => {
    jest.clearAllMocks();
    overlayContainer.ngOnDestroy();
  });

  test('should not show dropdown initially', async () => {
    expect(await harness.isOpen()).toBe(false);
  });

  test('should open dropdown when menu button is clicked', async () => {
    await harness.open();

    expect(await harness.isOpen()).toBe(true);
  });

  test('should close dropdown when menu button is clicked again', async () => {
    await harness.open();
    expect(await harness.isOpen()).toBe(true);

    await harness.open();
    expect(await harness.isOpen()).toBe(false);
  });

  test('should close dropdown when backdrop is clicked', async () => {
    await harness.open();
    expect(await harness.isOpen()).toBe(true);

    await harness.clickBackdrop();
    expect(await harness.isOpen()).toBe(false);
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated.set(false);
    });

    test('should show "Login" in action button', async () => {
      await harness.open();

      expect(await harness.getActionButtonText()).toBe('Login');
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated.set(true);
    });

    test('should show "Logout" in action button', async () => {
      await harness.open();

      expect(await harness.getActionButtonText()).toBe('Logout');
    });

    test('should call logout when Logout is clicked', async () => {
      await harness.open();
      await harness.clickActionButton();

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(await harness.isOpen()).toBe(false);
    });
  });
});
