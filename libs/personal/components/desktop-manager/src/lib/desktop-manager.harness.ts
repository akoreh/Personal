import { ComponentHarness, parallel } from '@angular/cdk/testing';

import { DesktopIconHarness } from './components/desktop-icon/desktop-icon.harness';

export class DesktopManagerHarness extends ComponentHarness {
  static hostSelector = 'ps-desktop-manager';

  private readonly _getApps = this.locatorForAll(DesktopIconHarness);

  async getApps(): Promise<Array<string>> {
    const options = await this._getApps();

    return parallel(() => options.map((option) => option.getName()));
  }

  async openApp(name: string): Promise<void> {
    const locator = this.locatorFor(DesktopIconHarness.with({ name }));

    return (await locator()).open();
  }
}
