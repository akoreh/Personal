import { BaseHarness, byTestId } from '@po/shared/testing';

export class MenuBarTimeHarness extends BaseHarness {
  static hostSelector = 'ps-menubar-time';

  async getDate(): Promise<string> {
    return this._getText(byTestId('date'));
  }

  async getTime(): Promise<string> {
    return this._getText(byTestId('time'), { normaliseWhitespace: true });
  }

  async getDateTime(): Promise<string> {
    return this._getText(byTestId('dateTime'), {
      normaliseWhitespace: true,
    });
  }
}
