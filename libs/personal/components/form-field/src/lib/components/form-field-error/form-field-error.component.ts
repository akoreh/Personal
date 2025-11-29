import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-form-field-error',
  templateUrl: './form-field-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'alert',
    'aria-live': 'assertive',
  },
})
export class FormFieldErrorComponent {}
