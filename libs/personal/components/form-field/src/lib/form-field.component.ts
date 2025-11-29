import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
} from '@angular/core';
import { isNil } from 'lodash-es';

import { FormFieldControl } from './directives/form-field.directive';

@Component({
  selector: 'ps-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class FormFieldComponent implements AfterContentInit {
  protected readonly showErrors = computed(() => {
    const control = this.control();

    if (isNil(control)) {
      return false;
    }

    return control.hasError();
  });

  private readonly control = contentChild(FormFieldControl);

  ngAfterContentInit(): void {
    const control = this.control();

    if (isNil(control)) {
      throw new Error('FormFieldControl not found');
    }
  }
}
