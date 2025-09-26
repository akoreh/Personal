import { TERMINAL_COMMANDS } from '../const/terminal-commands.const';

export interface TerminalCommand {
  command: (typeof TERMINAL_COMMANDS)[number];
  commandArguments?: TerminalCommandArgument[];
  shortHelpDescription?: string;
}

export interface TerminalCommandArgument {
  name: string;
}
