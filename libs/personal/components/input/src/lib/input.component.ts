import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  computed,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  CanUpdateErrorState,
  FormFieldControl,
  mixinErrorState,
} from '@po/personal/components/form-field';

import { InputType } from './types/input.type';

const InputBase = mixinErrorState(class {});

@Component({
  selector: 'ps-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  providers: [
    {
      provide: FormFieldControl,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
  host: {
    class: 'block',
    '[attr.data-type]': 'type()',
  },
})
export class InputComponent
  extends InputBase
  implements
    DoCheck,
    ControlValueAccessor,
    FormFieldControl,
    CanUpdateErrorState
{
  static nextId = 0;

  protected readonly id = `ps-input-${InputComponent.nextId++}`;

  readonly placeholder = input.required<string>();

  readonly value = model<string | number>();
  readonly disabled = model(false);

  readonly label = input<string>();
  readonly type = input<InputType>('text');

  readonly min = input(null, { transform: numberAttribute });
  readonly max = input(null, { transform: numberAttribute });

  protected readonly internalType = computed(() => {
    const type = this.type();

    if (type === 'double' || type === 'integer') {
      return 'text';
    }

    return type;
  });

  protected readonly inputMode = computed(() => {
    const type = this.type();

    if (type === 'integer') {
      return 'numeric';
    }

    if (type === 'double') {
      return 'decimal';
    }

    return 'text';
  });

  constructor() {
    super();

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  private readonly ngControl = inject(NgControl, { optional: true });

  private onChange?: (value: string | number) => void;
  private onTouched?: () => void;

  ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const originalValue = target.value;
    let value: string | number = originalValue;

    const type = this.type();

    if (type === 'integer') {
      value = value.replace(/[^0-9]/g, '');
      value = parseInt(value, 10);

      if (value.toString() !== originalValue) {
        target.value = value.toString();
      }
    }

    // // For double type, allow decimals
    // else if (this.type() === 'double') {
    //   value = value.replace(/[^0-9.]/g, '');
    //   // Ensure only one decimal point
    //   const parts = value.split('.');
    //   if (parts.length > 2) {
    //     value = parts[0] + '.' + parts.slice(1).join('');
    //     target.value = value;
    //   }
    // }

    this.value.set(value);

    if (this.onChange) {
      this.onChange(value);
    }
  }

  protected onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }
  protected onKeyDown(event: KeyboardEvent): void {
    const type = this.type();
    const key = event.key;

    // Allow control keys
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'Tab' ||
      key === 'Escape' ||
      key === 'Enter' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End' ||
      event.ctrlKey ||
      event.metaKey // Allow Ctrl/Cmd combinations
    ) {
      return;
    }

    if (type === 'integer') {
      // Only allow digits
      if (!/^[0-9]$/.test(key)) {
        event.preventDefault();
      }
    } else if (type === 'double') {
      const target = event.target as HTMLInputElement;
      const currentValue = target.value;

      // Allow digits and decimal point
      if (!/^[0-9.]$/.test(key)) {
        event.preventDefault();
        return;
      }

      // Prevent multiple decimal points
      if (key === '.' && currentValue.includes('.')) {
        event.preventDefault();
      }
    }
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: string | number): void {
    this.value.set(value ?? '');
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
