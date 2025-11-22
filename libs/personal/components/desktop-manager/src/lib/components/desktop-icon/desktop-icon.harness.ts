import { ComponentHarness } from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

import { IconHarness } from '@po/personal/components/icon/testing';
import { SvgIconName } from '@po/personal/services/icon';

export class DesktopIconHarness extends ComponentHarness {
  static hostSelector = 'ps-desktop-icon';

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

  async doubleClick(): Promise<void> {
    const button = await this.locatorFor(byTestId('button'))();
    return button.dispatchEvent('dblclick');
  }
}
