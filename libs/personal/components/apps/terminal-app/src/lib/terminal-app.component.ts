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
  private readonly _container = viewChild<ElementRef>('container');

  private readonly availableCommands = terminalCommands.map(
    ({ command }) => command,
  );

  private commandHistory: string[] = [];
  private historyIndex = -1;
  private tempCommand = '';

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
    const fullCommand = this.command().trim();

    if (!fullCommand) {
      this.pushEmptyExecution();
      return;
    }

    // Add to command history
    if (
      fullCommand &&
      fullCommand !== this.commandHistory[this.commandHistory.length - 1]
    ) {
      this.commandHistory.push(fullCommand);
    }
    this.historyIndex = -1;
    this.tempCommand = '';

    const { baseCommand, args } = this.parseCommand(fullCommand);

    this.printToStdOut(`$ ${fullCommand}`);

    const command = find(
      terminalCommands,
      ({ command }) => command === baseCommand,
    );

    if (!command) {
      this.printToStdOut(`\ncommand not found: ${baseCommand}`);
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
        case 'pwd':
          this.onPwd();
          break;
        case 'cd':
          this.onCd(args);
          break;
        case 'cat':
          this.onCat(args);
          break;
        case 'echo':
          this.onEcho(args);
          break;
        case 'date':
          this.onDate();
          break;
        case 'env':
          this.onEnv();
          break;
        case 'history':
          this.onHistory();
          break;
        case 'about':
          this.onAbout();
          break;
        case 'skills':
          this.onSkills();
          break;
        case 'projects':
          this.onProjects();
          break;
        case 'contact':
          this.onContact();
          break;
        default:
          noop();
          break;
      }
    }

    this.pushEmptyExecution();
    this.cursorPos.set(0);
    this.command.set('');

    // Auto-scroll to bottom
    setTimeout(() => this.scrollToBottom(), 10);
  }

  private scrollToBottom(): void {
    const container = this._container()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  protected onUpdateCursorPosition() {
    this.cursorPos.set(this.input.selectionStart ?? 0);
  }

  protected onFocusInput(): void {
    this.input.focus();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    // Handle Ctrl+C / Cmd+C - Cancel current command
    const isCommandC = this.isMacOS
      ? event.metaKey && event.key === 'c'
      : event.ctrlKey && event.key === 'c';

    if (isCommandC) {
      event.preventDefault();
      this.command.set('');
      this.cursorPos.set(0);
      if (this.command()) {
        this.printToStdOut(`$ ${this.command()}^C`);
        this.pushEmptyExecution();
      }
      return;
    }

    // Handle Ctrl+L / Cmd+L - Clear screen
    const isCommandL = this.isMacOS
      ? event.metaKey && event.key === 'l'
      : event.ctrlKey && event.key === 'l';

    if (isCommandL) {
      event.preventDefault();
      this.onClear();
      this.command.set('');
      this.cursorPos.set(0);
      return;
    }

    // Handle Ctrl+U - Clear line
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
      this.command.set('');
      this.cursorPos.set(0);
      this.input.value = '';
      return;
    }

    // Handle Ctrl+A - Move to beginning
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      this.input.selectionStart = 0;
      this.input.selectionEnd = 0;
      this.cursorPos.set(0);
      return;
    }

    // Handle Ctrl+E - Move to end
    if (event.ctrlKey && event.key === 'e') {
      event.preventDefault();
      const len = this.command().length;
      this.input.selectionStart = len;
      this.input.selectionEnd = len;
      this.cursorPos.set(len);
      return;
    }

    // Handle Arrow Up - Previous command in history
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.commandHistory.length === 0) return;

      if (this.historyIndex === -1) {
        this.tempCommand = this.command();
        this.historyIndex = this.commandHistory.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }

      this.command.set(this.commandHistory[this.historyIndex]);
      this.input.value = this.commandHistory[this.historyIndex];
      setTimeout(() => {
        this.input.selectionStart = this.input.value.length;
        this.input.selectionEnd = this.input.value.length;
        this.cursorPos.set(this.input.value.length);
      });
      return;
    }

    // Handle Arrow Down - Next command in history
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex === -1) return;

      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.command.set(this.commandHistory[this.historyIndex]);
        this.input.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.command.set(this.tempCommand);
        this.input.value = this.tempCommand;
      }

      setTimeout(() => {
        this.input.selectionStart = this.input.value.length;
        this.input.selectionEnd = this.input.value.length;
        this.cursorPos.set(this.input.value.length);
      });
      return;
    }

    // Handle Tab - Command completion
    if (event.key === 'Tab') {
      event.preventDefault();
      const currentCmd = this.command().toLowerCase();
      if (!currentCmd) return;

      const matches = this.availableCommands.filter((cmd) =>
        cmd.startsWith(currentCmd),
      );

      if (matches.length === 1) {
        this.command.set(matches[0]);
        this.input.value = matches[0];
        setTimeout(() => {
          this.input.selectionStart = matches[0].length;
          this.input.selectionEnd = matches[0].length;
          this.cursorPos.set(matches[0].length);
        });
      } else if (matches.length > 1) {
        this.printToStdOut(`\n${matches.join('  ')}`);
        this.pushEmptyExecution();
      }
      return;
    }
  }

  private onHelp(): void {
    this.printToStdOut(
      `\nAvailable commands:\n\n${this.availableCommands.join('\n')}`,
    );
  }

  private onCowSay(args: Array<string>): void {
    const message = args.join(' ') || 'Hello!';
    this.printToStdOut(
      `\n ________
< ${message} >
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
        `\nAuthentication status: ${this.authStore.isAuthenticated() ? 'authenticated' : 'unauthenticated'}`,
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
        this.printToStdOut('\nAuthenticating...');

        await this.authStore.login({ email, password });

        if (this.authStore.isAuthenticated()) {
          this.printToStdOut('\nAuthentication successful');
        } else {
          this.printToStdOut('\nAuthentication failed');
        }
      } catch (error) {
        this.printToStdOut(
          `\nAuthentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }

      return;
    }

    this.printToStdOut(`\nUnknown argument: ${argument}`);
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

    this.printToStdOut('\n' + parts.join(', '));
  }

  private onClear(): void {
    this.terminalEvents.set([]);
    this.pushEmptyExecution();
  }

  private onList(): void {
    this.printToStdOut('\nProjects/');
  }

  private pushEmptyExecution(): void {
    this.terminalEvents.update((terminalEvents) => [
      ...terminalEvents,
      new TerminalEvent(this.currentPath()),
    ]);
  }

  private onWhoAmI(): void {
    if (this.authStore.isAuthenticated()) {
      this.printToStdOut('\n' + (this.authStore.email() as string));
    } else {
      this.printToStdOut('\nguest');
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

  private onPwd(): void {
    this.printToStdOut('\n' + this.currentPath());
  }

  private onCd(args: string[]): void {
    if (!args.length || args[0] === '~') {
      this.currentPath.set('~/Desktop');
      this.printToStdOut('');
    } else if (args[0] === '..') {
      const parts = this.currentPath().split('/');
      if (parts.length > 2) {
        parts.pop();
        this.currentPath.set(parts.join('/'));
      }
      this.printToStdOut('');
    } else {
      this.currentPath.set(`${this.currentPath()}/${args[0]}`);
      this.printToStdOut('');
    }
  }

  private onCat(args: string[]): void {
    if (!args.length) {
      this.printToStdOut('\ncat: missing file operand');
      return;
    }

    const filename = args[0];
    const files: Record<string, string> = {
      'README.md': `# Welcome to my Portfolio Terminal\n\nThis is an interactive terminal portfolio.\nTry these commands:\n  - about\n  - skills\n  - projects\n  - contact`,
      'skills.txt': 'TypeScript, Angular, React, Node.js, Python, Docker, AWS',
      'contact.txt': 'Email: your.email@example.com\nGitHub: @yourusername',
    };

    if (files[filename]) {
      this.printToStdOut('\n' + files[filename]);
    } else {
      this.printToStdOut(`\ncat: ${filename}: No such file or directory`);
    }
  }

  private onEcho(args: string[]): void {
    this.printToStdOut('\n' + args.join(' '));
  }

  private onDate(): void {
    const now = new Date();
    this.printToStdOut('\n' + now.toLocaleString());
  }

  private onEnv(): void {
    const env = [
      `USER=${this.authStore.isAuthenticated() ? this.authStore.email() : 'guest'}`,
      `PATH=${this.currentPath()}`,
      `SHELL=/bin/zsh`,
      `TERM=xterm-256color`,
      `HOME=~/Desktop`,
    ];
    this.printToStdOut('\n' + env.join('\n'));
  }

  private onHistory(): void {
    if (this.commandHistory.length === 0) {
      this.printToStdOut('\nNo commands in history');
      return;
    }
    const history = this.commandHistory
      .map((cmd, idx) => `  ${idx + 1}  ${cmd}`)
      .join('\n');
    this.printToStdOut('\n' + history);
  }

  private onAbout(): void {
    this.printToStdOut(
      `\n╔═══════════════════════════════════════╗\n` +
        `║      PORTFOLIO TERMINAL v1.0          ║\n` +
        `╚═══════════════════════════════════════╝\n\n` +
        `Welcome to my interactive terminal portfolio!\n\n` +
        `This is a fully functional terminal emulator built with:\n` +
        `  • Angular 20+ with Signals\n` +
        `  • TypeScript\n` +
        `  • Nx Monorepo\n` +
        `  • Tailwind CSS\n\n` +
        `Type 'help' to see all available commands.`,
    );
  }

  private onSkills(): void {
    this.printToStdOut(
      `\n🚀 Technical Skills\n\n` +
        `Frontend:\n` +
        `  • Angular, React, Vue.js\n` +
        `  • TypeScript, JavaScript (ES6+)\n` +
        `  • RxJS, NgRx, Redux\n` +
        `  • HTML5, CSS3, SCSS, Tailwind\n\n` +
        `Backend:\n` +
        `  • Node.js, Express\n` +
        `  • Python, FastAPI\n` +
        `  • RESTful APIs, GraphQL\n\n` +
        `Tools & Others:\n` +
        `  • Git, Docker, Kubernetes\n` +
        `  • AWS, Azure\n` +
        `  • CI/CD, Jest, Cypress\n` +
        `  • Nx, Monorepo Architecture`,
    );
  }

  private onProjects(): void {
    this.printToStdOut(
      `\n📁 Notable Projects\n\n` +
        `1. Terminal Portfolio (this!)\n` +
        `   A fully interactive terminal-based portfolio\n` +
        `   Tech: Angular, TypeScript, Nx\n\n` +
        `2. Window Manager System\n` +
        `   macOS-like window management in the browser\n` +
        `   Tech: Angular, CDK, Signals\n\n` +
        `3. Authentication System\n` +
        `   JWT-based auth with secure token handling\n` +
        `   Tech: Angular, RxJS, SignalStore\n\n` +
        `Type 'cat README.md' for more info.`,
    );
  }

  private onContact(): void {
    this.printToStdOut(
      `\n📫 Get in Touch\n\n` +
        `Email:    your.email@example.com\n` +
        `GitHub:   github.com/yourusername\n` +
        `LinkedIn: linkedin.com/in/yourprofile\n` +
        `Website:  yourwebsite.com\n\n` +
        `Feel free to reach out for opportunities or collaborations!`,
    );
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
