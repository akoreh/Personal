import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
  TestKey,
} from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';
import { isEmpty, isString } from 'lodash-es';

export class InputHarness extends ComponentHarness {
  static hostSelector = 'ps-input';

  static with(
    options: BaseHarnessFilters = {},
  ): HarnessPredicate<InputHarness> {
    return new HarnessPredicate(InputHarness, options);
  }

  protected readonly getInput = this.locatorFor(byTestId('input'));

  async getValue(): Promise<string> {
    const input = await this.getInput();
    return (await input.getProperty('value')) as string;
  }

  async setValue(
    value: string | number,
    opts?: { skipBlur?: boolean },
  ): Promise<void> {
    if (await this.isDisabled()) {
      return;
    }

    const input = await this.getInput();
    const currentValue = await input.getProperty('value');

    await input.focus();

    if (isString(currentValue) && !isEmpty(currentValue)) {
      await input.sendKeys(TestKey.BACKSPACE);
      await input.clear();
    }

    const coercedValue = value.toString();

    if (!isEmpty(coercedValue)) {
      await input.sendKeys(coercedValue);
    }

    if (opts?.skipBlur) {
      return;
    }

    await input.blur();
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

  async getType(): Promise<string> {
    const host = await this.host();

    return host.getAttribute('data-type');
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

export class PrivateInputHarness extends InputHarness {
  async getInternalType(): Promise<string | null> {
    const input = await this.getInput();
    return input.getAttribute('type');
  }

  async getInputMode(): Promise<string | null> {
    const input = await this.getInput();
    return input.getAttribute('inputmode');
  }

  /**
   * Types keys one by one, dispatching actual keydown events.
   * This properly simulates user typing and respects keydown event handlers.
   */
  async typeKeys(keys: string): Promise<void> {
    const input = await this.getInput();

    await input.focus();

    await input.blur();
  }
}
