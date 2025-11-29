import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AppRegistryService } from '@po/personal/state/window';

import { appDefinitions } from './app.registry';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAppInitializer(() => {
      inject(AppRegistryService).registerApps(appDefinitions);
    }),
  ],
};
