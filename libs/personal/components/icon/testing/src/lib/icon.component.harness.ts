import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

import { SvgIconName } from '@po/personal/services/icon';

import { iconTestId } from './constants/icon-testing.const';

export class IconHarness extends ComponentHarness {
  static hostSelector = 'ps-icon';

  static with(options: BaseHarnessFilters = {}): HarnessPredicate<IconHarness> {
    return new HarnessPredicate(IconHarness, options);
  }

  private readonly _getIcon = this.locatorFor(byTestId(iconTestId));

  async getIcon(): Promise<SvgIconName> {
    const icon = await this._getIcon();

    return icon.text() as Promise<SvgIconName>;
  }
}
