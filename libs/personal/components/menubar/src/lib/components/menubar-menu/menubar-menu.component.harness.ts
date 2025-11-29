import { ComponentHarness } from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

export class MenuBarMenuHarness extends ComponentHarness {
  static hostSelector = 'ps-menubar-menu';

  private readonly rootLocator = this.documentRootLocatorFactory();

  private readonly getTrigger = this.locatorFor(byTestId('menubarMenuButton'));

  private getDropdown = this.rootLocator.locatorForOptional(
    byTestId('menubarMenuDropdown'),
  );

  private getActionButton = this.locatorForOptional(
    byTestId('menubarMenuAction'),
  );

  async open(): Promise<void> {
    const button = await this.getTrigger();

    await button.click();
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getDropdown());
  }

  async getActionButtonText(): Promise<string | null> {
    const button = await this.getActionButton();
    return button ? button.text() : null;
  }

  async clickActionButton(): Promise<void> {
    const button = await this.getActionButton();
    if (!button) {
      throw new Error('Action button not found');
    }
    await button.click();
  }

  async clickBackdrop(): Promise<void> {
    const backdrop = await this.documentRootLocatorFactory().locatorFor(
      '.cdk-overlay-transparent-backdrop',
    )();
    await backdrop.click();
  }
}
