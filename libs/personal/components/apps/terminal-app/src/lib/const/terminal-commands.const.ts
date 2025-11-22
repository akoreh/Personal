import { TerminalCommand } from '../models/terminal-command.model';

export const TERMINAL_COMMANDS = [
  'clear',
  'auth',
  'ls',
  'pwd',
  'cd',
  'cat',
  'echo',
  'date',
  'env',
  'history',
  'hello',
  'whoami',
  'uptime',
  'cowsay',
  'about',
  'skills',
  'projects',
  'contact',
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
    command: 'pwd',
    shortHelpDescription: 'Print current working directory',
  },
  {
    command: 'cd',
    shortHelpDescription: 'Change directory',
  },
  {
    command: 'cat',
    shortHelpDescription: 'Display file contents',
  },
  {
    command: 'echo',
    shortHelpDescription: 'Display a line of text',
  },
  {
    command: 'date',
    shortHelpDescription: 'Display current date and time',
  },
  {
    command: 'env',
    shortHelpDescription: 'Display environment information',
  },
  {
    command: 'history',
    shortHelpDescription: 'Display command history',
  },
  {
    command: 'about',
    shortHelpDescription: 'About this portfolio',
  },
  {
    command: 'skills',
    shortHelpDescription: 'Display technical skills',
  },
  {
    command: 'projects',
    shortHelpDescription: 'List notable projects',
  },
  {
    command: 'contact',
    shortHelpDescription: 'Get contact information',
  },
  {
    command: 'help',
    shortHelpDescription: 'Print all available commands',
  },
];
