import { AppId } from '@po/personal/enums';
import { AppDefinition } from '@po/personal/state/window';

export const appDefinitions: Array<AppDefinition> = [
  {
    id: AppId.Resume,
    route: 'resume',
    metadata: {
      appTitle: 'Resume',
      appIcon: 'document-text',
      appClosable: true,
      appMinimizable: true,
      appMaximizable: true,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/resume-app').then(
        (m) => m.ResumeAppComponent,
      ),
  },
  {
    id: AppId.Terminal,
    route: 'terminal',
    metadata: {
      appTitle: 'Terminal',
      appIcon: 'terminal',
      appClosable: true,
      appMinimizable: true,
      appMaximizable: true,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/terminal-app').then(
        (m) => m.TerminalAppComponent,
      ),
  },
];
