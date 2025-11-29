import { Directive, Signal } from '@angular/core';

@Directive()
export abstract class FormFieldControl {
  abstract readonly hasError: Signal<boolean>;

  updateErrorState?: () => void;
}
