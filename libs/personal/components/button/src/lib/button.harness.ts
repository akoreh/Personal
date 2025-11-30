import { ComponentHarness } from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

export class ButtonHarness extends ComponentHarness {
  static hostSelector = 'ps-button';

  private readonly getButton = this.locatorFor(byTestId('btn'));

  async getLabel(): Promise<string> {
    const locator = this.locatorFor(byTestId('innerContent'));

    return (await locator()).text();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getButton()).getProperty('disabled');
  }

  async click(): Promise<void> {
    return (await this.getButton()).click();
  }
}
