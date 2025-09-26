import { TerminalCommand } from '../models/terminal-command.model';

export const TERMINAL_COMMANDS = [
  'clear',
  'auth',
  'ls',
  'hello',
  'whoami',
  'uptime',
  'cowsay',
  'help',
] as const;

export const terminalCommands: TerminalCommand[] = [
  { command: 'clear', shortHelpDescription: 'Clears the entire console' },
  {
    command: 'auth',
    shortHelpDescription: 'Authentication related commands',
    commandArguments: [
      {
        name: 'status',
      },
      {
        name: 'login',
      },
      {
        name: 'logout',
      },
    ],
  },
  {
    command: 'ls',
    shortHelpDescription: 'Lists the contents of the current directory',
  },
  {
    command: 'hello',
    shortHelpDescription: 'Say hello',
  },
  {
    command: 'whoami',
    shortHelpDescription: 'Prints the name of the current user',
  },
  {
    command: 'uptime',
    shortHelpDescription: 'Prints the time since the system has been live',
  },
  {
    command: 'cowsay',
    shortHelpDescription: 'Make the cow say something',
  },
  {
    command: 'help',
    shortHelpDescription: 'Print all available commands',
  },
];
