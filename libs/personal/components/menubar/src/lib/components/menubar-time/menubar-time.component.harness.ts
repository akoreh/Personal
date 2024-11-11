import { BaseHarness, byTestId } from '@po/shared/testing';
import { replaceAll } from '@po/shared/utilities';

export class MenuBarTimeHarness extends BaseHarness {
  static hostSelector = 'ps-menubar-time';

  async getDate(): Promise<string> {
    return this._getText(byTestId('date'));
  }

  async getTime(): Promise<string> {
    const text = await this._getText(byTestId('time'), {
      normaliseWhitespace: true,
    });

    return replaceAll(text, ' : ', ':');
  }

  async getDateTime(): Promise<string> {
    const text = await this._getText(byTestId('dateTime'), {
      normaliseWhitespace: true,
    });

    return replaceAll(text, ' : ', ':');
  }
}
