import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { IconComponent } from '@po/personal/components/icon';
import { SvgIconName } from '@po/personal/services/icon';

import { IconTestingModule } from './icon-testing.module';
import { IconHarness } from './icon.component.harness';

@Component({
  selector: 'ps-host',
  template: ` <ps-icon [icon]="icon" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input({ required: true }) icon: SvgIconName = 'trash';
}

describe('Icon Component', () => {
  let spectator: Spectator<HostComponent>;
  let harness: IconHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [IconComponent, IconTestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(IconHarness);
  });

  test('should display the passed in icon', async () => {
    expect(await harness.getIcon()).toBe('trash');
    spectator.setInput('icon', 'battery-50');
    expect(await harness.getIcon()).toBe('battery-50');
  });
});
