import { AppDataSource, setupMiddleware } from '@po/backend/core';
import { EnvVar } from '@po/backend/enums';
import { healthRouter } from '@po/backend/modules/health';
import express from 'express';
import 'reflect-metadata';

import './env';

const port = parseInt((process.env[EnvVar.Port] || 3_000).toString(), 10);

const app = express();

setupMiddleware(app);

// API Routes
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
