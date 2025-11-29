/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { FormFieldControl } from './directives/form-field.directive';
import { FormFieldComponent } from './form-field.component';
import { FormFieldHarness } from './form-field.harness';

class MockFormFieldControl extends FormFieldControl {
  hasError = signal(false);
}

@Component({
  standalone: false,
  selector: 'ps-mock-input',
  template: '',
  providers: [{ provide: FormFieldControl, useExisting: MockInputComponent }],
})
class MockInputComponent extends MockFormFieldControl {}

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `
    <ps-form-field>
      <ps-mock-input />
      <ps-form-field-error>{{ errorMessage }}</ps-form-field-error>
    </ps-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input() errorMessage = 'This field is required';
}

@Component({
  standalone: false,
  selector: 'ps-host-no-control',
  template: `
    <ps-form-field>
      <input />
    </ps-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostNoControlComponent {}

describe('FormFieldComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: FormFieldHarness;
  let mockControl: MockInputComponent;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [FormFieldComponent, FormFieldErrorComponent, TestingModule],
    declarations: [MockInputComponent],
  });

  const createNoControlComponent = createComponentFactory({
    component: HostNoControlComponent,
    imports: [FormFieldComponent, TestingModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(FormFieldHarness);
    mockControl = spectator.query(MockInputComponent)!;
  });

  test('should hide errors when control has no error', async () => {
    mockControl.hasError.set(false);

    expect(await harness.getError()).toBeNull();
  });

  test('should show errors when control has error', async () => {
    mockControl.hasError.set(true);

    expect(await harness.getError()).toBe('This field is required');
  });

  test('should display error message when visible', async () => {
    spectator.setInput('errorMessage', 'Email is invalid');
    mockControl.hasError.set(true);

    expect(await harness.getError()).toBe('Email is invalid');
  });

  test('should toggle error visibility when error state changes', async () => {
    mockControl.hasError.set(false);
    expect(await harness.getError()).toBeNull();
    mockControl.hasError.set(true);
    expect(await harness.getError()).not.toBeNull();
    mockControl.hasError.set(false);
    expect(await harness.getError()).toBeNull();
  });

  test('should throw error if no FormFieldControl is provided', () => {
    expect(() => createNoControlComponent()).toThrow(
      'FormFieldControl not found',
    );
  });
});
