import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import { FormFieldErrorComponent } from './form-field-error.component';
import { FormFieldErrorHarness } from './form-field-error.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-form-field-error>{{ errorMessage }}</ps-form-field-error>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input() errorMessage = '';
}

describe('FormFieldErrorComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: FormFieldErrorHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [FormFieldErrorComponent, TestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(FormFieldErrorHarness);
  });

  test('should display error text', async () => {
    spectator.setInput('errorMessage', 'This field is required');

    expect(await harness.getText()).toBe('This field is required');
  });

  test('should update when error message changes', async () => {
    spectator.setInput('errorMessage', 'Invalid email');
    expect(await harness.getText()).toBe('Invalid email');

    spectator.setInput('errorMessage', 'Email already exists');
    expect(await harness.getText()).toBe('Email already exists');
  });

  test('should have alert role for accessibility', () => {
    const host = spectator.query('ps-form-field-error');
    expect(host!.getAttribute('role')).toBe('alert');
    expect(host!.getAttribute('aria-live')).toBe('assertive');
  });
});
