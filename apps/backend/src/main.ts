import { setupMiddleware } from '@po/backend/core';
import express from 'express';

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

app.listen(port, async () => {
  console.log(`API listening on port ${port}`);
});
