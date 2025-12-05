import { AppId } from '@po/personal/enums';
import { AppDefinition } from '@po/personal/state/window';

export const appDefinitions: Array<AppDefinition> = [
  {
    id: AppId.Auth,
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
    metadata: {
      title: 'Resume',
      icon: 'resume',
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
  {
    id: AppId.ComponentGallery,
    metadata: {
      title: 'Component Gallery',
      icon: 'cube',
      closable: true,
      minimizable: true,
      maximizable: true,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/component-gallery').then(
        (m) => m.ComponentGalleryAppComponent,
      ),
  },
  {
    id: AppId.DevTools,
    metadata: {
      title: 'Dev Tools',
      icon: 'code',
      closable: true,
      minimizable: true,
      maximizable: true,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/dev-tools').then(
        (m) => m.DevToolsComponent,
      ),
  },
  {
    id: AppId.JsEngine,
    metadata: {
      title: 'JS Engine Visualizer',
      icon: 'engine',
      closable: true,
      minimizable: true,
      maximizable: true,
    },
    loadComponent: () =>
      import('@po/personal/components/apps/js-visualizer-app').then(
        (m) => m.JsEngineAppComponent,
      ),
  },
];
