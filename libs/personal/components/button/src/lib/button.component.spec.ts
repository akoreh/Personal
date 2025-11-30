import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { noop } from 'lodash-es';

import { ButtonComponent } from './button.component';
import { ButtonHarness } from './button.harness';

describe('ButtonComponent', () => {
  @Component({
    standalone: false,
    selector: 'ps-host',
    template: `<ps-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      (clicked)="onClicked($event)"
      >{{ label }}</ps-button
    >`,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class HostComponent {
    @Input() label = 'Test Button';

    @Input() variant:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'danger'
      | 'warning'
      | 'success'
      | 'info' = 'default';

    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() disabled = false;

    onClicked(event: unknown): void {
      noop(event);
    }
  }

  describe('Normal Usage', () => {
    let spectator: Spectator<HostComponent>;
    let harness: ButtonHarness;

    const createComponent = createComponentFactory({
      component: HostComponent,
      imports: [ButtonComponent],
    });

    beforeEach(async () => {
      spectator = createComponent();
      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      harness = await loader.getHarness(ButtonHarness);
    });

    test('should display the passed in label', async () => {
      expect(await harness.getLabel()).toBe('Test Button');
      spectator.setInput('label', 'something');
      expect(await harness.getLabel()).toBe('something');
    });

    test('should be able to control the disabled state', async () => {
      expect(await harness.isDisabled()).toBe(false);
      spectator.setInput('disabled', true);
      expect(await harness.isDisabled()).toBe(true);
      spectator.setInput('disabled', false);
      expect(await harness.isDisabled()).toBe(false);
    });

    describe('onClick', () => {
      let clickSpy: jest.SpyInstance;

      beforeEach(() => {
        clickSpy = jest.spyOn(spectator.component, 'onClicked');
      });

      test('should emit when clicked', async () => {
        await harness.click();
        await harness.click();
        await harness.click();

        expect(clickSpy).toHaveBeenCalledTimes(3);
        expect(clickSpy).toHaveBeenCalledWith(undefined);
      });

      test('should NOT emit when disabled', async () => {
        spectator.setInput('disabled', true);
        expect(await harness.isDisabled()).toBe(true);

        await harness.click();
        await harness.click();

        expect(clickSpy).not.toHaveBeenCalled();

        spectator.setInput('disabled', false);
        expect(await harness.isDisabled()).toBe(false);

        await harness.click();

        expect(clickSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  @Component({
    standalone: false,
    selector: 'ps-host',
    template: `<ps-button />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class DefaultsHostComponent {}

  describe('Defaults', () => {
    let spectator: Spectator<DefaultsHostComponent>;
    let harness: ButtonHarness;

    const createComponent = createComponentFactory({
      component: DefaultsHostComponent,
      imports: [ButtonComponent],
    });

    beforeEach(async () => {
      spectator = createComponent();
      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      harness = await loader.getHarness(ButtonHarness);
    });

    test('should NOT have a label by default', async () => {
      expect(await harness.getLabel()).toBe('');
    });

    test('should NOT be disabled by default', async () => {
      expect(await harness.isDisabled()).toBe(false);
    });
  });
});
