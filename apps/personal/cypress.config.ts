import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'cypress',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run personal:serve',
        production: 'nx run personal:serve:production',
      },
      ciWebServerCommand: 'nx run personal:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
