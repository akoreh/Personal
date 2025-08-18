const TERMINAL_COMMANDS = ['clear', 'auth', 'ls', 'hello'] as const;

export interface TerminalCommand {
  command: (typeof TERMINAL_COMMANDS)[number];
  commandArguments?: TerminalCommandArgument[];
  shortHelpDescription?: string;
}

export interface TerminalCommandArgument {
  name: string;
}
