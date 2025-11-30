import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

import { FormFieldErrorHarness } from './components/form-field-error/form-field-error.harness';

export class FormFieldHarness extends ComponentHarness {
  static hostSelector = 'ps-form-field';

  static with(
    options: BaseHarnessFilters = {},
  ): HarnessPredicate<FormFieldHarness> {
    return new HarnessPredicate(FormFieldHarness, options);
  }

  private readonly _getError = this.locatorForOptional(FormFieldErrorHarness);

  async getError(): Promise<string | null> {
    const error = await this._getError();

    if (error) {
      return error.getText();
    }

    return null;
  }
}
