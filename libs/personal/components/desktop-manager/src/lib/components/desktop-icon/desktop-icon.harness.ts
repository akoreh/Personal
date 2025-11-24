import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

import { IconHarness } from '@po/personal/components/icon/testing';
import { SvgIconName } from '@po/personal/services/icon';

interface DesktopIconHarnessFilters extends BaseHarnessFilters {
  name?: string;
}

export class DesktopIconHarness extends ComponentHarness {
  static hostSelector = 'ps-desktop-icon';

  static with(
    options: DesktopIconHarnessFilters = {},
  ): HarnessPredicate<DesktopIconHarness> {
    const predicate = new HarnessPredicate(DesktopIconHarness, options);

    predicate.addOption(
      'name',
      options.name,
      async (harness, name) => (await harness.getName()) === name,
    );

    return predicate;
  }

  protected readonly getButton = this.locatorFor(byTestId('button'));

  async getName(): Promise<string> {
    const locator = this.locatorFor(byTestId('name'));

    return (await locator()).text();
  }

  async getIcon(): Promise<SvgIconName> {
    const locator = this.locatorFor(
      IconHarness.with({ selector: byTestId('icon') }),
    );

    return (await locator()).getIcon();
  }

  async open(): Promise<void> {
    return (await this.getButton()).dispatchEvent('dblclick');
  }
}
