/* eslint-disable @angular-eslint/prefer-standalone */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import 'zone.js/testing';

import { IconTestingModule } from '@po/personal/components/icon/testing';
import { WindowManagerService } from '@po/personal/state/window';

import { DesktopManagerComponent } from './desktop-manager.component';
import { DesktopManagerHarness } from './desktop-manager.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-desktop-manager />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

describe('DesktopManagerComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: DesktopManagerHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [DesktopManagerComponent, IconTestingModule],
    providers: [
      {
        provide: WindowManagerService,
        useFactory: () => ({
          openApp: jest.fn(),
        }),
      },
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(DesktopManagerHarness);
  });

  test('should display the correct apps', async () => {
    expect(await harness.getApps()).toEqual(['Resume.peedeef']);
  });

  describe('Opening apps', () => {
    let openSpy: jest.SpyInstance;

    beforeEach(() => {
      openSpy = jest.spyOn(spectator.inject(WindowManagerService), 'openApp');
    });

    test('should be able to open the resume app', async () => {
      await harness.openApp('Resume.peedeef');

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith('resume');
    });
  });
});
