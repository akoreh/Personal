import { ComponentHarness } from '@angular/cdk/testing';

import { MenuBarTimeHarness } from './components/menubar-time/menubar-time.component.harness';

export class MenuBarHarness extends ComponentHarness {
  static hostSelector = 'ps-menubar';

  private readonly getMenuBarTime = this.locatorFor(MenuBarTimeHarness);

  async getDateTime(): Promise<string> {
    return (await this.getMenuBarTime()).getDateTime();
  }
}
