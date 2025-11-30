import { WritableSignal, inject, signal } from '@angular/core';
import {
  FormGroupDirective,
  NgControl,
  NgForm,
  UntypedFormControl,
} from '@angular/forms';
import { AbstractConstructor, Constructor } from '@po/shared/models';

export interface CanUpdateErrorState {
  hasError: WritableSignal<boolean>;

  updateErrorState(): void;
}

type CanUpdateErrorStateCtor = Constructor<CanUpdateErrorState> &
  AbstractConstructor<CanUpdateErrorState>;

export function mixinErrorState<T extends AbstractConstructor<any>>(
  base: T,
): CanUpdateErrorStateCtor & T;

export function mixinErrorState<T extends Constructor<any>>(
  base: T,
): CanUpdateErrorStateCtor & T {
  return class extends base {
    readonly hasError = signal(false);

    private readonly parentForm = inject(NgForm, { optional: true });
    private readonly parentFormGroup = inject(FormGroupDirective, {
      optional: true,
    });
    private readonly ngControl = inject(NgControl, { optional: true });

    constructor(...args: Array<any>) {
      super(...args);
    }

    protected updateErrorState(): void {
      if (!this.ngControl) {
        return;
      }

      const form = this.parentFormGroup || this.parentForm;
      const control = this.ngControl.control as UntypedFormControl;

      const oldState = this.hasError();

      const newState = !!(
        control &&
        control.invalid &&
        (control.touched || (form && form.submitted))
      );

      if (newState !== oldState) {
        this.hasError.set(newState);
      }
    }
  };
}
