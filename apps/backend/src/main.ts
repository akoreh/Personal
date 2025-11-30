// prettier-ignore-file
import 'reflect-metadata';
import './env';

import { AppDataSource, setupMiddleware } from '@po/backend/core';
import { setupSwagger } from '@po/backend/swagger';
import { EnvVar } from '@po/backend/enums';
import { authRouter } from '@po/backend/modules/auth';
import { healthRouter } from '@po/backend/modules/health';
import { getEnvVar } from '@po/backend/utilities';
import express, { Application } from 'express';
import { join } from 'path';


export function createApp(): Application {
  const app = express();

  setupMiddleware(app);

  if (getEnvVar(EnvVar.SwaggerEnabled)) {
    setupSwagger(app);
  }

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/health', healthRouter);

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public/index.html'));
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow: /`);
  });

  return app;
}

export async function bootstrap() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();

      console.log('Database connection established');
    }

    const port = parseInt(getEnvVar(EnvVar.Port), 10);
    const app = createApp();

    console.info(`Hosting Environment: ${getEnvVar(EnvVar.HostingEnv)}` )

    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Only run bootstrap if this file is executed directly (not imported)
if (require.main === module) {
  bootstrap();
}
