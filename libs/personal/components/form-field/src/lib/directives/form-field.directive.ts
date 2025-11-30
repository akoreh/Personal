import { Directive, WritableSignal } from '@angular/core';

import { CanUpdateErrorState } from '../mixins/error-state.mixin';

@Directive()
export abstract class FormFieldControl implements CanUpdateErrorState {
  abstract readonly hasError: WritableSignal<boolean>;

  updateErrorState!: () => void;
}
