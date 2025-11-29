import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import { IconTestingModule } from '@po/personal/components/icon/testing';
import { AuthStore } from '@po/personal/state/auth';

import { MenuBarComponent } from './menubar.component';
import { MenuBarHarness } from './menubar.component.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-menubar />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

const mockAuthStore = {
  isAuthenticated: signal(false),
  email: signal(null as string | null),
  userId: signal(null as string | null),
  accessToken: signal(null as string | null),
  refreshToken: signal(null as string | null),
};

const createComponent = createComponentFactory({
  component: HostComponent,
  imports: [MenuBarComponent, TestingModule, IconTestingModule],
  providers: [{ provide: AuthStore, useValue: mockAuthStore }],
});

describe('Menu Bar Component', () => {
  let spectator: Spectator<HostComponent>;
  let harness: MenuBarHarness;

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(MenuBarHarness);
  });

  test('should boot', () => {
    expect(harness).not.toBeUndefined();
  });
});

describe('Menu Bar Component - Date Time', () => {
  let spectator: Spectator<HostComponent>;
  let harness: MenuBarHarness;

  beforeEach(async () => {
    jest.useFakeTimers({
      doNotFake: ['queueMicrotask'],
      now: new Date(2024, 10, 11, 9, 56, 41),
    });

    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(MenuBarHarness);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should display today's date and time in a nice format", async () => {
    expect(await harness.getDateTime()).toBe('Mon 11 Nov 09:56:41');

    jest.useRealTimers();
  });
});
