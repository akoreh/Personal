import cors from 'cors';
import express from 'express';

const port = parseInt((process.env['PORT'] || 3_000).toString(), 10);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /`);
});

app.listen(port, async () => {
  console.log(`API listening on port ${port}`);
});
