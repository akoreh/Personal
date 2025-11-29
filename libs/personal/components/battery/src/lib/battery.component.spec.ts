/* eslint-disable @angular-eslint/prefer-standalone */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import { BatteryComponent } from './battery.component';
import { BatteryHarness } from './battery.component.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-battery [level]="level" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input() level = 100;
}

describe('BatteryComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: BatteryHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [BatteryComponent, TestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(BatteryHarness);
  });

  describe('fill width', () => {
    test('should show full width at 100%', async () => {
      spectator.setInput('level', 100);

      expect(await harness.getFillWidth()).toBe(15);
    });

    test('should show half width at 50%', async () => {
      spectator.setInput('level', 50);

      expect(await harness.getFillWidth()).toBe(7.5);
    });

    test('should show no width at 0%', async () => {
      spectator.setInput('level', 0);

      expect(await harness.getFillWidth()).toBe(0);
    });

    test('should show proportional width at 75%', async () => {
      spectator.setInput('level', 75);

      expect(await harness.getFillWidth()).toBe(11.25);
    });

    test('should clamp values above 100%', async () => {
      spectator.setInput('level', 150);

      expect(await harness.getFillWidth()).toBe(15);
    });

    test('should clamp negative values to 0', async () => {
      spectator.setInput('level', -50);

      expect(await harness.getFillWidth()).toBe(0);
    });
  });

  describe('battery fill color', () => {
    test('should be green at 100%', async () => {
      spectator.setInput('level', 100);

      expect(await harness.getFillColor()).toContain('fill-accent-green');
    });

    test('should be green at 51%', async () => {
      spectator.setInput('level', 51);

      expect(await harness.getFillColor()).toContain('fill-accent-green');
    });

    test('should be orange at 50%', async () => {
      spectator.setInput('level', 50);

      expect(await harness.getFillColor()).toContain('fill-primary-orange');
    });

    test('should be orange at 36%', async () => {
      spectator.setInput('level', 36);

      expect(await harness.getFillColor()).toContain('fill-primary-orange');
    });

    test('should be red at 35%', async () => {
      spectator.setInput('level', 35);

      expect(await harness.getFillColor()).toContain('fill-primary-red');
    });

    test('should be red at 20%', async () => {
      spectator.setInput('level', 20);

      expect(await harness.getFillColor()).toContain('fill-primary-red');
    });

    test('should be red at 0%', async () => {
      spectator.setInput('level', 0);

      expect(await harness.getFillColor()).toContain('fill-primary-red');
    });
  });
});
