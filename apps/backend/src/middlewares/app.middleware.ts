import cors from 'cors';
import { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const registerCors = (app: Express): void => {
  app.use(cors({ credentials: true, origin: true }));
  app.options('*', cors());
};

const registerHelmet = (app: Express): void => {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      referrerPolicy: {
        policy: 'no-referrer',
      },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: { policy: 'unsafe-none' },
    }),
  );
};

const registerRateLimit = (app: Express): void => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });

  app.use(limiter);
};

export const registerAppMiddlewares = (app: Express): void => {
  app.disable('x-powered-by');

  registerCors(app);
  registerHelmet(app);
  registerRateLimit(app);
};
