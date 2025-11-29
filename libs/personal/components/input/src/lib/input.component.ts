import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ps-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class InputComponent implements ControlValueAccessor {
  static nextId = 0;

  protected readonly id = `ps-input-${InputComponent.nextId++}`;

  readonly value = model<string>();
  readonly label = input<string>();
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly disabled = model(false);
  readonly error = input<string>();

  protected readonly isFocused = signal(false);
  protected readonly isTouched = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  protected onFocus(): void {
    this.isFocused.set(true);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
    this.isTouched.set(true);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
