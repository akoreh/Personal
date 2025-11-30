import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  CanUpdateErrorState,
  FormFieldControl,
  mixinErrorState,
} from '@po/personal/components/form-field';

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

  readonly value = model<string>();
  readonly label = input<string>();
  readonly placeholder = input.required<string>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly disabled = model(false);

  constructor() {
    super();

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  private readonly ngControl = inject(NgControl, { optional: true });

  private onChange?: (value: string) => void;
  private onTouched?: () => void;

  ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.value.set(target.value);

    if (this.onChange) {
      this.onChange(target.value);
    }
  }

  protected onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
