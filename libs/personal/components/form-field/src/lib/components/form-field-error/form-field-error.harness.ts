import { ComponentHarness } from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

export class FormFieldErrorHarness extends ComponentHarness {
  static hostSelector = 'ps-form-field-error';

  async getText(): Promise<string> {
    const locator = this.locatorFor(byTestId('fieldError'));

    return (await locator()).text();
  }
}
