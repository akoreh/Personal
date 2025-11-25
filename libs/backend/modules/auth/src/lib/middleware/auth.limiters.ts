import { buildError } from '@po/backend/utilities';
import { ErrorCode } from '@po/shared/enums';
import { rateLimit } from 'express-rate-limit';

const fifteenMin = 15 * 60 * 1000;
const oneHour = 60 * 60 * 1000;

export const authLimiter = rateLimit({
  windowMs: fifteenMin,
  limit: 5, // Only 5 login attempts per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: buildError(ErrorCode.TooManyAuthRequests),
  skipSuccessfulRequests: true,
});

export const registerLimiter = rateLimit({
  windowMs: oneHour,
  limit: 3, // Only 3 registration attempts per hour
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: buildError(ErrorCode.TooManyRegistrations),
});
