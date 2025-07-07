import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ISODateString } from '@po/shared/models';
import { intervalToDuration } from 'date-fns';
import { noop } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import { TerminalAppStatusBarComponent } from './components/terminal-app-status-bar/terminal-app-status-bar.component';

@Component({
  selector: 'ps-terminal-app',
  templateUrl: './terminal-app.component.html',
  styleUrl: 'terminal-app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TerminalAppStatusBarComponent, FormsModule],
  providers: [DecimalPipe],
})
export class TerminalAppComponent implements OnInit, AfterViewInit {
  protected readonly currentPath = signal<string>('~/Desktop');

  protected readonly executions = signal<
    Array<{
      id: string;
      path: string;
      stdout?: string;
      command?: string;
      createdAt: ISODateString;
    }>
  >([]);

  protected readonly availableCommands = [
    // 'cd',
    'clear',
    'ls',
    'hello',
    'uptime',
    'cowsay',
  ];

  protected readonly command = signal<string>('');
  protected readonly cursorPos = signal<number>(0);

  private readonly _input = viewChild('input');

  private get input(): HTMLInputElement {
    return (this._input() as ElementRef<HTMLInputElement>)?.nativeElement;
  }

  private readonly decimalPipe = inject(DecimalPipe);

  ngOnInit() {
    this.pushEmptyExecution();
  }

  ngAfterViewInit() {
    this.onFocusInput();
  }

  onExecCommand(): void {
    const fullCommand = this.command().toLowerCase();
    const split = fullCommand.split(' ');
    const command = split[0];
    const args = split.slice(1);

    if (this.availableCommands.includes(command) || command === 'help') {
      switch (command) {
        case 'clear':
          this.onClear();
          break;
        case 'ls':
          this.onList(command);
          break;
        case 'hello':
          this.printToStdOut(command, 'Hi there, friend. 🐧');
          break;
        case 'uptime':
          this.onUptime(command);
          break;
        case 'cowsay':
          this.onCowSay(fullCommand, args);
          break;
        case 'help':
          this.onHelp(command);
          break;
        default:
          noop();
          break;
      }
    } else {
      this.printToStdOut(command, `command not found: ${command}`);
    }

    this.pushEmptyExecution();
    this.cursorPos.set(0);
    this.command.set('');
  }

  onUpdateCursorPosition() {
    this.cursorPos.set(this.input.selectionStart ?? 0);
  }

  onFocusInput(): void {
    this.input.focus();
  }

  private onHelp(command: string): void {
    this.printToStdOut(
      command,
      `available commands: \n\n${this.availableCommands.join('\n')}`,
    );
  }

  private onCowSay(command: string, args: Array<string>): void {
    this.printToStdOut(
      command,
      ` ________
< ${args.join(' ')} >
 --------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
    );
  }

  private onUptime(command: string): void {
    const date = new Date(-8_640_000_000_000_000);
    const duration = intervalToDuration({ start: date, end: new Date() });
    const parts: Array<string> = [];

    const format = (value: number): string =>
      this.decimalPipe.transform(value) as string;

    if (duration.years) {
      parts.push(
        duration.years > 1 ? `${format(duration.years)} years` : '1 year',
      );
    }

    if (duration.months) {
      parts.push(
        duration.months > 1 ? `${format(duration.months)} months` : '1 month',
      );
    }

    if (duration.days) {
      parts.push(duration.days > 1 ? `${format(duration.days)} days` : '1 day');
    }

    if (duration.minutes) {
      parts.push(
        duration.minutes > 1
          ? `${format(duration.minutes)} minutes`
          : '1 minute',
      );
    }

    if (duration.seconds) {
      parts.push(
        duration.seconds > 1
          ? `${format(duration.seconds)} seconds`
          : '1 second',
      );
    }

    this.printToStdOut(command, parts.join(', '));
  }

  private onClear(): void {
    this.executions.set([]);
  }

  private onList(command: string): void {
    this.printToStdOut(command, `Projects`);
  }

  private pushEmptyExecution(): void {
    this.executions.update((executions) => [
      ...executions,
      {
        id: uuid(),
        path: this.currentPath(),
        stdout: undefined,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  private printToStdOut(command: string, stdout: string): void {
    this.executions.update((executions) => {
      const clone = [...executions];

      const lastItem = {
        ...clone[clone.length - 1],
        command,
        stdout,
      };

      clone.pop();

      clone.push(lastItem);

      return clone;
    });
  }
}
