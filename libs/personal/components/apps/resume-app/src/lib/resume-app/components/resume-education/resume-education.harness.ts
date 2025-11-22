import { ComponentHarness } from '@angular/cdk/testing';
import { byTestId } from '@po/shared/testing';

export class EducationHarness extends ComponentHarness {
  static hostSelector = 'ps-resume-education';

  private readonly _getSchool = this.locatorFor(byTestId('school'));
  private readonly _getDegree = this.locatorFor(byTestId('degree'));
  private readonly _getDates = this.locatorFor(byTestId('dates'));

  async getSchool(): Promise<string> {
    return (await this._getSchool()).text();
  }

  async getDegree(): Promise<string> {
    return (await this._getDegree()).text();
  }

  async getDates(): Promise<string> {
    return (await this._getDates()).text();
  }
}
