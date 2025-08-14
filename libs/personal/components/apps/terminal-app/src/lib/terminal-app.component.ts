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
import { get, noop } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import { AuthStore } from '@po/personal/state/auth';

import { TerminalAppStatusBarComponent } from './components/terminal-app-status-bar/terminal-app-status-bar.component';
import { terminalCommands } from './const/terminal-commands.const';
import { TerminalCommand } from './models/terminal-command.model';
import { TerminalEvent } from './models/terminal-event.model';

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

  protected readonly terminalEvents = signal<TerminalEvent[]>([
    new TerminalEvent(this.currentPath()),
  ]);

  protected readonly command = signal<string>('');
  protected readonly cursorPos = signal<number>(0);
  protected readonly isLoginFlow = signal<boolean>(false);

  private readonly _input = viewChild('input');

  private readonly availableCommands = terminalCommands.map(
    ({ command }) => command,
  );

  private get input(): HTMLInputElement {
    return (this._input() as ElementRef<HTMLInputElement>)?.nativeElement;
  }

  private readonly decimalPipe = inject(DecimalPipe);
  private readonly authStore = inject(AuthStore);

  ngOnInit() {
    this.pushEmptyExecution();
  }

  ngAfterViewInit() {
    this.onFocusInput();
  }

  onExecCommand(): void {
    const fullCommand = this.command().toLowerCase();
    const split = fullCommand.split(' ');
    const typedCommand = split[0].trim();
    const command = terminalCommands.find(
      ({ command }) => command === typedCommand,
    );

    if (!command) {
      this.printToStdOut(typedCommand, `command not found: ${typedCommand}`);
    } else {
      const args = split.slice(1);

      switch (command.command) {
        case 'clear':
          this.onClear();
          break;
        // case 'ls':
        //   this.onList(command);
        //   break;
        // case 'hello':
        //   this.printToStdOut(command, 'Hi there, friend. 🐧');
        //   break;
        // case 'uptime':
        //   this.onUptime(command);
        //   break;
        // case 'cowsay':
        //   this.onCowSay(fullCommand, args);
        //   break;
        // case 'help':
        //   this.onHelp(command);
        //   break;
        case 'auth':
          this.onAuth(fullCommand, command, args);
          break;
        default:
          noop();
          break;
      }
    }

    this.pushEmptyExecution();
    this.cursorPos.set(0);
    this.command.set('');
  }

  protected onUpdateCursorPosition() {
    this.cursorPos.set(this.input.selectionStart ?? 0);
  }

  protected onFocusInput(): void {
    this.input.focus();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isLoginFlow()) {
      const isCommandC = this.isMacOS
        ? event.metaKey && event.key === 'c'
        : event.ctrlKey && event.key === 'c';

      if (isCommandC) {
        event.preventDefault();

        this.isLoginFlow.set(false);
      }
    }
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

  private onAuth(
    typedCommand: string,
    command: TerminalCommand,
    args: Array<string>,
  ): void {
    if (!args.length) {
      this.printToStdOut(typedCommand, 'Invalid number of arguments');

      return;
    }

    const argument = args[0];

    if (argument === 'status') {
      this.printToStdOut(
        typedCommand,
        `Authentication status: ${this.authStore.isAuthenticated() ? 'authenticated' : 'unauthenticated'}`,
      );

      return;
    }

    this.printToStdOut(typedCommand, `Unknown argument: ${argument}`);
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
    this.terminalEvents.set([new TerminalEvent(this.currentPath())]);
  }

  private onList(command: string): void {
    this.printToStdOut(command, `Projects`);
  }

  private pushEmptyExecution(): void {
    this.terminalEvents.update((terminalEvents) => [
      ...terminalEvents,
      new TerminalEvent(this.currentPath()),
    ]);
  }

  private printToStdOut(command: string, stdout: string): void {
    this.terminalEvents.update((events) => {
      const clone = [...events];

      clone[clone.length - 1].pushToStdOut(stdout);

      return clone;
    });
  }

  private get isMacOS(): boolean {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }
}
