import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { noop } from 'lodash-es';

import { IconTestingModule } from '@po/personal/components/icon/testing';
import { SvgIconName } from '@po/personal/services/icon';

import { DesktopIconComponent } from './desktop-icon.component';
import { DesktopIconHarness } from './desktop-icon.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-desktop-icon
    [name]="name"
    [icon]="icon"
    (open)="onOpen($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input() name = 'Manele';
  @Input() icon: SvgIconName = 'battery-50';

  onOpen(...args: Array<unknown>): void {
    noop(args);
  }
}

class PrivateHarness extends DesktopIconHarness {
  async click(): Promise<void> {
    return (await this.getButton()).click();
  }
}

describe('DesktopIconComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: PrivateHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [DesktopIconComponent, IconTestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(PrivateHarness);
  });

  test('should display the passed in name', async () => {
    expect(await harness.getName()).toBe('Manele');
    spectator.setInput('name', 'Florin Salam');
    expect(await harness.getName()).toBe('Florin Salam');
  });

  test('should display the passed in icon', async () => {
    expect(await harness.getIcon()).toBe('battery-50');
    spectator.setInput('icon', 'resume');
    expect(await harness.getIcon()).toBe('resume');
  });

  describe('Opening', () => {
    let openSpy: jest.SpyInstance;

    beforeEach(() => {
      openSpy = jest.spyOn(spectator.component, 'onOpen');
    });

    test('should emit on double click', async () => {
      await harness.open();

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith(undefined);
    });

    test('should NOT emit on a single click', async () => {
      await harness.click();
      expect(openSpy).not.toHaveBeenCalled();
    });
  });
});
