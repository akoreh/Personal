// prettier-ignore-file
import 'reflect-metadata';
import './env';

import { AppDataSource, setupMiddleware } from '@po/backend/core';
import { EnvVar } from '@po/backend/enums';
import { authRouter } from '@po/backend/modules/auth';
import { healthRouter } from '@po/backend/modules/health';
import { getEnvVar } from '@po/backend/utilities';
import express from 'express';


const port = parseInt(getEnvVar(EnvVar.Port), 10);

const app = express();

setupMiddleware(app);

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/health', healthRouter);

// Utility Routes
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /`);
});

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
