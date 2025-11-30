import { AppId } from '@po/personal/enums';
import { AppDefinition } from '@po/personal/state/window';

export const appDefinitions: Array<AppDefinition> = [
  {
    id: AppId.Auth,
    route: 'auth',
    metadata: {
      title: 'Authenticator',
      icon: 'key',
      closable: true,
      minimizable: false,
      maximizable: false,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/auth-app').then(
        (m) => m.AuthAppComponent,
      ),
  },
  {
    id: AppId.Resume,
    route: 'resume',
    metadata: {
      title: 'Resume',
      icon: 'document-text',
      closable: true,
      minimizable: true,
      maximizable: true,
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
      title: 'Terminal',
      icon: 'terminal',
      closable: true,
      minimizable: true,
      maximizable: true,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/terminal-app').then(
        (m) => m.TerminalAppComponent,
      ),
  },
];
