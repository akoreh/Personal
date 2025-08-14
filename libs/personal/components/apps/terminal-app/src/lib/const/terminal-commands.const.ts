import { TerminalCommand } from '../models/terminal-command.model';

export const terminalCommands: TerminalCommand[] = [
  { command: 'clear', shortHelpDescription: 'Clears the entire console' },
  {
    command: 'auth',
    shortHelpDescription: 'Authentication related commands',
    commandArguments: [
      {
        name: 'status',
      },
    ],
  },
];
