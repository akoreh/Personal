/* eslint-disable @angular-eslint/prefer-standalone */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { IconTestingModule } from '@po/personal/components/icon/testing';
import { SvgIconName } from '@po/personal/services/icon';

import { DesktopIconComponent } from './desktop-icon.component';
import { DesktopIconHarness } from './desktop-icon.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-desktop-icon [name]="name" [icon]="icon" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input() name = 'Manele';
  @Input() icon: SvgIconName = 'battery-50';
}

describe('DesktopIconComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: DesktopIconHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [DesktopIconComponent, IconTestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(DesktopIconHarness);
  });

  test('should boot', () => {
    expect(harness).toBeTruthy();
  });

  // Add additional harness-driven tests here as behavior is implemented.
});
