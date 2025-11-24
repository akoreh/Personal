import { BaseHarness, byTestId } from '@po/shared/testing';

export class TerminalAppStatusBarHarness extends BaseHarness {
  static hostSelector = 'ps-terminal-app-status-bar';

  async getPath(): Promise<string> {
    return this._getText(byTestId('path'));
  }

  async getDate(): Promise<string> {
    return this._getText(byTestId('date'));
  }
}
