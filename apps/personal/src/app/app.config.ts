import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AppRegistryService } from '@po/personal/state/window';

import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: (registry: AppRegistryService) => {
        return () => {
          registry.registerApps([
            {
              id: 'resume',
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
          ]);
        };
      },
      deps: [AppRegistryService],
      multi: true,
    },
  ],
};
