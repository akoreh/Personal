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
import { intervalToDuration } from 'date-fns';
import { find, noop } from 'lodash-es';

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

  protected readonly terminalEvents = signal<TerminalEvent[]>([]);

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

  async onExecCommand(): Promise<void> {
    const fullCommand = this.command();

    const { baseCommand, args } = this.parseCommand(fullCommand);

    this.printToStdOut(`$ ${fullCommand}\n\n`);

    const command = find(
      terminalCommands,
      ({ command }) => command === baseCommand,
    );

    if (!command) {
      this.printToStdOut(`command not found: ${baseCommand}`);
    } else {
      switch (command.command) {
        case 'clear':
          this.onClear();
          break;
        case 'ls':
          this.onList();
          break;
        case 'hello':
          this.printToStdOut('Hi there, friend. 🐧');
          break;
        case 'whoami':
          this.onWhoAmI();
          break;
        case 'uptime':
          this.onUptime();
          break;
        case 'cowsay':
          this.onCowSay(args);
          break;
        case 'help':
          this.onHelp();
          break;
        case 'auth':
          await this.onAuth(command, args);
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

  private onHelp(): void {
    this.printToStdOut(
      `available commands: \n\n${this.availableCommands.join('\n')}`,
    );
  }

  private onCowSay(args: Array<string>): void {
    this.printToStdOut(
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

  private async onAuth(
    command: TerminalCommand,
    args: Array<string>,
  ): Promise<void> {
    if (!args.length) {
      this.printToStdOut('Invalid number of arguments');

      return;
    }

    const argument = args[0];

    if (argument === 'status') {
      this.printToStdOut(
        `Authentication status: ${this.authStore.isAuthenticated() ? 'authenticated' : 'unauthenticated'}`,
      );

      return;
    }

    if (argument === 'login') {
      if (args.length < 3) {
        this.printToStdOut('Usage: auth login <email> <password>');

        return;
      }

      const email = args[1];
      const password = args[2];

      try {
        this.printToStdOut('Authenticating...');

        await this.authStore.login({ email, password });

        if (this.authStore.isAuthenticated()) {
          this.printToStdOut('Authentication successful');
        } else {
          this.printToStdOut('Authentication failed');
        }
      } catch (error) {
        this.printToStdOut(
          `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }

      return;
    }

    this.printToStdOut(`Unknown argument: ${argument}`);
  }

  private onUptime(): void {
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

    this.printToStdOut(parts.join(', '));
  }

  private onClear(): void {
    this.terminalEvents.set([]);
  }

  private onList(): void {
    this.printToStdOut(`Projects`);
  }

  private pushEmptyExecution(): void {
    this.terminalEvents.update((terminalEvents) => [
      ...terminalEvents,
      new TerminalEvent(this.currentPath()),
    ]);
  }

  private onWhoAmI(): void {
    if (this.authStore.isAuthenticated()) {
      this.printToStdOut(this.authStore.username() as string);
    } else {
      this.printToStdOut('guest');
    }
  }

  private printToStdOut(stdout: string): void {
    this.terminalEvents.update((events) => {
      const clone = [...events];

      clone[clone.length - 1].pushToStdOut(stdout);

      return clone;
    });
  }

  private get isMacOS(): boolean {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  private readonly parseCommand = (
    command: string,
  ): { baseCommand: string; args: string[] } => {
    const fullCommand = command;
    const split = fullCommand.split(' ');
    const baseCommand = split[0].trim().toLowerCase();

    return { baseCommand, args: [...split.slice(1)] };
  };
}
