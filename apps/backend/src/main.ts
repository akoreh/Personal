import { AppDataSource, setupMiddleware } from '@po/backend/core';
import express from 'express';
import 'reflect-metadata';

import './env';

const port = parseInt((process.env['PORT'] || 3_000).toString(), 10);

const app = express();

setupMiddleware(app);

// Middleware

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
