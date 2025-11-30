import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

export class InputHarness extends ComponentHarness {
  static hostSelector = 'ps-input';

  static with(
    options: BaseHarnessFilters = {},
  ): HarnessPredicate<InputHarness> {
    return new HarnessPredicate(InputHarness, options);
  }

  private getInput = this.locatorFor(byTestId('input'));

  async getValue(): Promise<string> {
    const input = await this.getInput();
    return (await input.getProperty('value')) as string;
  }

  async setValue(value: string): Promise<void> {
    const input = await this.getInput();
    await input.setInputValue(value);
  }

  async focus(): Promise<void> {
    const input = await this.getInput();
    await input.focus();
  }

  async blur(): Promise<void> {
    const input = await this.getInput();
    await input.blur();
  }

  async getPlaceholder(): Promise<string | null> {
    const input = await this.getInput();
    return input.getAttribute('placeholder');
  }

  async getType(): Promise<string | null> {
    const input = await this.getInput();
    return input.getAttribute('type');
  }

  async isDisabled(): Promise<boolean> {
    const input = await this.getInput();
    return input.getProperty('disabled') as Promise<boolean>;
  }

  async getLabel(): Promise<string | null> {
    const locator = this.locatorForOptional(byTestId('inputLabel'));

    const label = await locator();

    return label ? label.text() : null;
  }
}
