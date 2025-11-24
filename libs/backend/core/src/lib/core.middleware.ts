import bodyParser from 'body-parser';
import cors from 'cors';
import { Express } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import { frontendUrl, isHosted } from './backend-config';
import {
  preventInjection,
  sanitizeInput,
  securityLogger,
  validateRequestSize,
} from './security.middleware';

const fifteenMin = 15 * 60 * 1000;

const generalLimiter = rateLimit({
  windowMs: fifteenMin, // 15 minutes
  limit: 100, // General API calls
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    errorCode: 'TooManyRequests',
    errorMessage: 'Too many requests, please try again later.',
  },
});

// const authLimiter = rateLimit({
//   windowMs: fifteenMin, // 15 minutes
//   limit: 3, // Only 3 login attempts per 15 minutes
//   standardHeaders: 'draft-8',
//   legacyHeaders: false,
//   message: {
//     errorCode: 'TooManyAuthRequests',
//     errorMessage: 'Too many authentication attempts, please try again later.',
//   },
//   skipSuccessfulRequests: true,
// });

// const registerLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   limit: 3, // Only 3 registration attempts per hour
//   standardHeaders: 'draft-8',
//   legacyHeaders: false,
//   message: {
//     errorCode: 'TooManyRegistrations',
//     errorMessage: 'Too many registration attempts, please try again later.',
//   },
// });

const configuredHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' },
});

export const setupMiddleware = (app: Express): Express => {
  app.use(configuredHelmet);
  app.use(generalLimiter);
  app.use(securityLogger);
  app.use(validateRequestSize);
  app.use(sanitizeInput);
  app.use(preventInjection);

  //TODO: Apply specific rate limiters to auth routes
  //   app.use('/grocee/v1/auth/login', authLimiter);
  //   app.use('/grocee/v1/auth/register', registerLimiter);

  app.use(
    bodyParser.json({
      limit: '10mb',
      type: 'application/json',
    }),
  );

  app.use(
    bodyParser.urlencoded({
      limit: '10mb',
      extended: false,
      type: 'application/x-www-form-urlencoded',
    }),
  );

  app.use((req, res, next) => {
    res.setTimeout(30_000, () => {
      res.status(408).json({
        errorCode: 'RequestTimeout',
        errorMessage: 'Request timeout',
      });
    });
    next();
  });

  app.use((req, res, next) => {
    // Prevent information disclosure
    res.removeHeader('X-Powered-By');

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );

    // Prevent caching of sensitive endpoints
    if (req.path.includes('/auth/')) {
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    next();
  });

  if (isHosted()) {
    /**
     * Express is seeing the X-Forwarded-For header, but doesn't trust it — because by default, express does not trust proxies, which Heroku (and most platforms) use by default.
     * This affects libraries like express-rate-limit that depend on the client's IP to apply limits.
     */
    app.set('trust proxy', 1); // Trust the first proxy, heroku

    console.info('Set the trust proxy configuration');
  } else {
    console.info('Using non hosted config');

    app.use(
      cors({
        origin: frontendUrl(),
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );
  }

  return app;
};
