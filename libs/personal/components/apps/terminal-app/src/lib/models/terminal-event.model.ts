import { ISODateString } from '@po/shared/models';
import { v4 as uuidv4 } from 'uuid';

export class TerminalEvent {
  readonly id: string;
  readonly createdAt: ISODateString;

  get stdOut(): string {
    return this._stdOut;
  }

  constructor(readonly path: string) {
    this.id = uuidv4();
    this.createdAt = new Date().toISOString();
  }

  private _stdOut = '';

  pushToStdOut(stdOut: string): void {
    this._stdOut += `${stdOut}`;
  }
}
