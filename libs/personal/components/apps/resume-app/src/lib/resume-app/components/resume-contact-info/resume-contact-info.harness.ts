import { ComponentHarness } from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

export class ContactInfoHarness extends ComponentHarness {
  static hostSelector = 'ps-resume-contact-info';

  private readonly _getEmail = this.locatorFor(byTestId('email'));
  private readonly _getLinkedIn = this.locatorFor(byTestId('linkedin'));

  async getEmail(): Promise<string> {
    return (await this._getEmail()).text();
  }

  async getEmailHref(): Promise<string> {
    return (await this._getEmail()).getAttribute('href');
  }

  async getLinkedIn() {
    return (await this._getLinkedIn()).text();
  }

  async getLinkedInHref() {
    return (await this._getLinkedIn()).getAttribute('href');
  }

  async getLocation() {
    const locator = this.locatorFor(byTestId('location'));

    return (await locator()).text();
  }
}
