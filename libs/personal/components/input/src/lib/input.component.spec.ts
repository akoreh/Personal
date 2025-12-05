/* eslint-disable @angular-eslint/prefer-standalone */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule } from '@po/shared/testing';

import {
  FormFieldComponent,
  FormFieldErrorComponent,
} from '@po/personal/components/form-field';

import { InputComponent } from './input.component';
import { PrivateInputHarness } from './input.harness';

describe('InputComponent', () => {
  @Component({
    standalone: false,
    selector: 'ps-host-default',
    template: `<ps-input [placeholder]="placeholder" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class DefaultHostComponent {
    @Input() placeholder = 'Enter text';
  }

  describe('Default Behavior', () => {
    let spectator: Spectator<DefaultHostComponent>;
    let harness: PrivateInputHarness;

    const createComponent = createComponentFactory({
      component: DefaultHostComponent,
      imports: [InputComponent, TestingModule],
    });

    beforeEach(async () => {
      spectator = createComponent();
      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      harness = await loader.getHarness(PrivateInputHarness);
    });

    test('should display the placeholder', async () => {
      expect(await harness.getPlaceholder()).toBe('Enter text');
      spectator.setInput('placeholder', 'New placeholder');
      expect(await harness.getPlaceholder()).toBe('New placeholder');
    });

    test('should have text type by default', async () => {
      expect(await harness.getType()).toBe('text');
    });

    test('should NOT display a label by default', async () => {
      expect(await harness.getLabel()).toBeNull();
    });

    test('should NOT be disabled by default', async () => {
      expect(await harness.isDisabled()).toBe(false);
    });

    test('should NOT have a value by default', async () => {
      expect(await harness.getValue()).toBe('');
    });
  });

  @Component({
    standalone: false,
    selector: 'ps-host-standalone',
    template: `
      <ps-input
        [placeholder]="placeholder"
        [type]="type"
        [label]="label"
        [(value)]="value"
        [(disabled)]="disabled"
      />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class StandaloneHostComponent {
    @Input() placeholder = 'Enter email';
    @Input() type = 'text';
    @Input() label = 'Email Address';

    value = signal<string | number>('');
    disabled = signal(false);
  }

  describe('Standalone Behavior', () => {
    let spectator: Spectator<StandaloneHostComponent>;
    let harness: PrivateInputHarness;

    const createComponent = createComponentFactory({
      component: StandaloneHostComponent,
      imports: [InputComponent, TestingModule],
    });

    beforeEach(async () => {
      spectator = createComponent();
      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      harness = await loader.getHarness(PrivateInputHarness);
    });

    describe('Type', () => {
      test('should use the passed in type', async () => {
        expect(await harness.getType()).toBe('text');
      });

      test('should use a different internal type', async () => {
        expect(await harness.getType()).toBe('text');
        expect(await harness.getInternalType()).toBe('text');

        spectator.setInput('type', 'password');
        expect(await harness.getType()).toBe('password');
        expect(await harness.getInternalType()).toBe('password');

        spectator.setInput('type', 'integer');
        expect(await harness.getType()).toBe('integer');
        expect(await harness.getInternalType()).toBe('text');

        spectator.setInput('type', 'double');
        expect(await harness.getType()).toBe('double');
        expect(await harness.getInternalType()).toBe('text');
      });

      test('should use a different input mode for numbers', async () => {
        expect(await harness.getInputMode()).toBe('text');

        spectator.setInput('type', 'integer');
        expect(await harness.getInputMode()).toBe('numeric');

        spectator.setInput('type', 'double');
        expect(await harness.getInputMode()).toBe('decimal');
      });
    });

    describe('Labelling', () => {
      test('should display the label', async () => {
        expect(await harness.getLabel()).toBe('Email Address');
        spectator.setInput('label', 'some other label');
        expect(await harness.getLabel()).toBe('some other label');
      });

      test('should display the placeholder', async () => {
        expect(await harness.getPlaceholder()).toBe('Enter email');
        spectator.setInput('placeholder', 'some other placeholder');
        expect(await harness.getPlaceholder()).toBe('some other placeholder');
      });
    });

    describe('Value', () => {
      beforeEach(async () => {
        expect(await harness.getValue()).toBe('');
      });

      describe('Text Mode', () => {
        beforeEach(() => {
          spectator.setInput('type', 'text');
        });

        test('should be able to enter a value and have it emitted', async () => {
          await harness.setValue('florin Salam');

          expect(await harness.getValue()).toBe('florin Salam');
          expect(spectator.component.value()).toBe('florin Salam');
        });

        test('should update value via two-way binding', async () => {
          spectator.component.value.set('initial@test.com');

          expect(await harness.getValue()).toBe('initial@test.com');

          await harness.setValue('updated@test.com');
          expect(spectator.component.value()).toBe('updated@test.com');
        });
      });

      describe('Integer Mode', () => {
        beforeEach(() => {
          spectator.setInput('type', 'integer');
        });

        test('should be able to enter an integer and have it emitted', async () => {
          await harness.setValue(12345);

          expect(await harness.getValue()).toBe('12345');
          expect(spectator.component.value()).toBe(12345);
        });

        test('should filter out non-numeric characters when entering values, allowing only digits 0-9', async () => {
          await harness.setValue(
            'a1b2c3!@#$%^&*()_+-=[]{}|;:,.<>?/~`456def789ABC',
          );
          expect(await harness.getValue()).toBe('123456789');
        });
      });
    });

    test('should handle disabled state', async () => {
      expect(await harness.isDisabled()).toBe(false);

      spectator.component.disabled.set(true);
      spectator.detectChanges();

      expect(await harness.isDisabled()).toBe(true);
    });

    test('should support focus and blur', async () => {
      await harness.focus();
      // Focus state is set

      await harness.blur();
      // Blur triggers onTouched callback
    });

    test('should handle different input types', async () => {
      spectator.setInput('type', 'password');
      expect(await harness.getType()).toBe('password');

      spectator.setInput('type', 'text');
      expect(await harness.getType()).toBe('text');
    });
  });

  @Component({
    standalone: false,
    selector: 'ps-host-form-control',
    template: `
      <form>
        <ps-form-field>
          <ps-input
            [placeholder]="placeholder"
            [type]="type"
            [label]="label"
            [formControl]="emailControl"
          />
          <ps-form-field-error>{{ errorMessage }}</ps-form-field-error>
        </ps-form-field>
      </form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class FormControlHostComponent {
    @Input() placeholder = 'Enter your email';
    @Input() type = 'email';
    @Input() label = 'Email';
    @Input() errorMessage = 'Email is required';

    emailControl = new FormControl('', [Validators.required, Validators.email]);
  }

  describe('Form Control Behavior', () => {
    let spectator: Spectator<FormControlHostComponent>;
    let harness: PrivateInputHarness;

    const createComponent = createComponentFactory({
      component: FormControlHostComponent,
      imports: [
        InputComponent,
        FormFieldComponent,
        FormFieldErrorComponent,
        ReactiveFormsModule,
        TestingModule,
      ],
    });

    beforeEach(async () => {
      spectator = createComponent();
      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      harness = await loader.getHarness(PrivateInputHarness);
    });

    test('should boot', () => {
      expect(harness).toBeTruthy();
    });

    test('should integrate with FormControl', async () => {
      const control = spectator.component.emailControl;

      expect(await harness.getValue()).toBe('');
      expect(control.value).toBe('');

      await harness.setValue('test@example.com');
      expect(control.value).toBe('test@example.com');
    });

    test('should display validation errors', async () => {
      const control = spectator.component.emailControl;

      // Mark as touched to trigger validation display
      control.markAsTouched();
      spectator.detectChanges();

      expect(control.invalid).toBe(true);
      expect(control.hasError('required')).toBe(true);
    });

    test('should update when FormControl value changes', async () => {
      const control = spectator.component.emailControl;

      control.setValue('programmatic@test.com');
      spectator.detectChanges();

      expect(await harness.getValue()).toBe('programmatic@test.com');
    });

    test('should handle FormControl disabled state', async () => {
      const control = spectator.component.emailControl;

      expect(await harness.isDisabled()).toBe(false);

      control.disable();
      spectator.detectChanges();

      expect(await harness.isDisabled()).toBe(true);

      control.enable();
      spectator.detectChanges();

      expect(await harness.isDisabled()).toBe(false);
    });

    test('should validate email format', async () => {
      const control = spectator.component.emailControl;

      await harness.setValue('invalid-email');
      control.markAsTouched();
      spectator.detectChanges();

      expect(control.hasError('email')).toBe(true);

      await harness.setValue('valid@example.com');
      spectator.detectChanges();

      expect(control.hasError('email')).toBe(false);
      expect(control.valid).toBe(true);
    });

    test('should trigger onTouched when blurred', async () => {
      const control = spectator.component.emailControl;

      expect(control.touched).toBe(false);

      await harness.focus();
      await harness.blur();
      spectator.detectChanges();

      expect(control.touched).toBe(true);
    });

    test('should work with ps-form-field error display', async () => {
      const control = spectator.component.emailControl;

      // Initially pristine, no error shown
      expect(control.pristine).toBe(true);

      // Mark as touched to trigger validation
      control.markAsTouched();
      spectator.detectChanges();

      // Should have error
      expect(control.invalid).toBe(true);

      // Add valid email
      await harness.setValue('valid@email.com');
      spectator.detectChanges();

      expect(control.valid).toBe(true);
    });

    test('should display label and placeholder together', async () => {
      expect(await harness.getLabel()).toBe('Email');
      expect(await harness.getPlaceholder()).toBe('Enter your email');
    });
  });
});
