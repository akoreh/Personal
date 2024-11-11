import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import { MenuBarTimeComponent } from './menubar-time.component';
import { MenuBarTimeHarness } from './menubar-time.component.harness';

@Component({
  selector: 'ps-host',
  template: `<ps-menubar-time />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

describe.skip('Menu Bar Time Component', () => {
  let spectator: Spectator<HostComponent>;
  let harness: MenuBarTimeHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [MenuBarTimeComponent, TestingModule],
  });

  beforeEach(async () => {
    jest.useFakeTimers({
      doNotFake: ['queueMicrotask'],
      now: new Date(2024, 10, 11, 9, 56, 41),
    });

    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(MenuBarTimeHarness);

    jest.useRealTimers();
  });

  test("should display today's date in a nice format", async () => {
    expect(await harness.getDate()).toBe('Mon 11 Nov');
  });

  test('should display the current time in a nice format', async () => {
    expect(await harness.getTime()).toBe('09:56:41');
  });

  test("should display today's date and time in a nice format", async () => {
    expect(await harness.getDateTime()).toBe('Mon 11 Nov 09:56:41');
  });
});
